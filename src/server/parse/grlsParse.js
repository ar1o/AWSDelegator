exports.updateTimeBudgets = function(){
	getTimeAmount();
}

var getTimeAmount = function(){
	MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        var maxBudgetLifetimes = {};
        mongoose.model('timeBudgets').find({
        	State: 'valid'
        }).exec(function(err, timeBudgets) {
            if (err) throw err;
			var index1 = 0;
			var controller1 = function() {
				iterator1(function() {
					index1++;
					if (index1 < timeBudgets.length) controller1();
					else {
						updateLifetime(maxBudgetLifetimes);
					}
				});
			};
			var iterator1 = function(callback1) {
				maxBudgetLifetimes[timeBudgets[index1].TimeBudgetName] = timeBudgets[index1].TimeAmount;
				callback1();
			};
			controller1();
        });
    });
}

var updateLifetime = function(maxBudgetLifetimes){
	MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        var currentDate = new Date();
		var currentTime = currentDate.getTime();
		var currentTimeIso = new Date(currentTime).toISOString();
		var t2HourlyEarning = {
			't2.micro': 6,
			't2.small': 12,
			't2.medium': 24,
			't2.large': 36
		};
		var budgetLifetimes = {};
		mongoose.model('grlsInstances').find({
			state: 'valid'
		}).exec(function(err, grlsInstances) {
		    if (err) throw err;
		    var index1 = 0;
			var controller1 = function() {
				iterator1(function() {
					index1++;
					if (index1 < grlsInstances.length) controller1();
					else {
						for(var budget in budgetLifetimes){
							if(budgetLifetimes[budget] >= maxBudgetLifetimes[budget]){
								stopTimeBudget(budget);
							}							
						}
					}
				});
			};
			var iterator1 = function(callback1) {
				AWS.config.region = grlsInstances[index1].instanceRegion.substring(0,grlsInstances[index1].instanceRegion.length-1);
				var cloudwatch = new AWS.CloudWatch();
				var uDecayRate = grlsInstances[index1].uDecay;
				var oDecayRate = grlsInstances[index1].oDecay;
				switch(grlsInstances[index1].serviceType){
				case 'ec2':
					var params = {
						EndTime: currentTimeIso,
						MetricName: 'CPUCreditBalance',
						Namespace: 'AWS/EC2',
						Period: 3600,
						StartTime: new Date(currentTime - 1000 * 3600 * 2).toISOString(),
						Statistics: ['Average'],
						Dimensions: [{
							Name: 'InstanceId',
							Value: grlsInstances[index1].instanceId
						}, ],
						Unit: 'Count'
					};
					cloudwatch.getMetricStatistics(params, function(err, data) {
						if (err) throw err;
						var decayRate = 1;
						var slope = data.Datapoints[1].Average - data.Datapoints[0].Average;
						var maxCredits = t2HourlyEarning[grlsInstances[index1].instanceType] * 24;
						if (slope < 1){
							if ((maxCredits - data.Datapoints[1].Average) < 0.1) {
								decayRate = uDecayRate;
							} else if (data.Datapoints[1].Average < (.02 * maxCredits)) {
								decayRate = oDecayRate;
							}
						}else if ((t2HourlyEarning[grlsInstances[index1].instanceType] - slope) < 0.1) {
							decayRate = uDecayRate;
						}
						mongoose.model('grlsInstances').update({
							instanceId: grlsInstances[index1].instanceId,
						}, {
							$set: {
								lifetime: grlsInstances[index1].lifetime + decayRate
							}
						}).exec(function(err) {
							if (err) throw err;
							if(!(grlsInstances[index1].timeBudgetName in budgetLifetimes)) {
								budgetLifetimes[grlsInstances[index1].timeBudgetName] = 0;
							}
							budgetLifetimes[grlsInstances[index1].timeBudgetName] += grlsInstances[index1].lifetime + decayRate;
							db.collection('grlsLineItems').insert({
								instanceId: grlsInstances[index1].instanceId,
								user: grlsInstances[index1].user,
								group: grlsInstances[index1].group,
								serviceType: grlsInstances[index1].serviceType,
								decayTime: decayRate,
								time: currentTimeIso
							}, function(err) {
								if (err) throw err;
								callback1();
							});
						});
					});					
					break;
				case 'rds':
					var params = {
						EndTime: currentTimeIso,
						MetricName: 'DatabaseConnections',
						Namespace: 'AWS/RDS',
						Period: 3600,
						StartTime: new Date(currentTime - 1000 * 3600).toISOString(),
						Statistics: ['Average'],
						Dimensions: [{
							Name: 'DBInstanceIdentifier',
							Value: grlsInstances[index1].instanceId
						}, ],
						Unit: 'Count'
					};
					cloudwatch.getMetricStatistics(params, function(err, data) {
						if (err) throw err;
						var decayRate = 1;
						if(data.Datapoints[0].Average==0){
							decayRate = uDecayRate;
						}else if(data.Datapoints[0].Average > grlsInstances[index1].maxConnectionsLimit){
							decayRate = oDecayRate;
						}
						mongoose.model('grlsInstances').update({
							instanceId: grlsInstances[index1].instanceId,
						}, {
							$set: {
								lifetime: grlsInstances[index1].lifetime - decayRate
							}
						}).exec(function(err) {
							if (err) throw err;
							if(!(grlsInstances[index1].timeBudgetName in budgetLifetimes)) {
								budgetLifetimes[grlsInstances[index1].timeBudgetName] = 0;
							}
							budgetLifetimes[grlsInstances[index1].timeBudgetName] += grlsInstances[index1].lifetime + decayRate;
							var zone = grlsInstances[index1].instanceRegion;
							zone = zone.substring(0,zone.length-1);
							var arn = 'arn:aws:rds:'+zone+':'+awsAccountNumber+':db:'+grlsInstances[index1].instanceId;
							db.collection('grlsLineItems').insert({
								instanceId: arn,
								user: grlsInstances[index1].user,
								group: grlsInstances[index1].group,
								serviceType: grlsInstances[index1].serviceType,
								decayTime: decayRate,
								time: currentTimeIso
							}, function(err) {
								if (err) throw err;
								callback1();
							});
						});
					});					
					break;
				default: 
					callback1();
					break;
				}
			};
			controller1();
		});
    });
}

var stopTimeBudget = function(timeBudget){
	var currentTime = currentDate.getTime();
	var currentTimeIso = new Date(currentTime).toISOString();
	mongoose.model('timeBudgets').update({
		TimeBudgetName: timeBudget,
	}, {
		$set: {
			State: 'invalid'
		}
	}).exec(function(err) {
		mongoose.model('grlsInstances').update({
			timeBudgetName: timeBudget
		}, {
			$set: {
				state: 'invalid'
			}
		},{
			multi: true
		}).exec(function(err) {
			if (err) throw err;
			db.collection('notifications').insert({
				NotificationType: 'TimeBudgetTimeOut',
				NotificationData: timeBudget,
				Seen: 'false',
				Time: currentTimeIso
			}, function(err) {
				if (err) throw err;

			});
		});
	});
}