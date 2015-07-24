exports.updateTimeBudgets = function(){
	getTimeAmount();
}

//get max TimeAmount for each instance, this result is used later 
//to identify budget timeout
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
			if(timeBudgets.length!=0){
				controller1();
			}
        });
    });
}

//update lifetime of instances based on their usage-profile
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
					//if t2 instance then use CPUCreditBalance for profiling-
					//if slope of credit balance is equal to max allowed usage limit 
					//for that instance type or 0 then apply under-profile decay rate,
					//if slope is 0 and credit balance is 0 then apply over-profile decay rate,
					//else check set to under-profile if under 2% CPUUtilization 
					//and over-profile if greater than 100%
					if(/^t2/.test(grlsInstances[index1].instanceType)){
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
					}else{
						var params = {
							EndTime: currentTimeIso,
							MetricName: 'CPUUtilization',
							Namespace: 'AWS/EC2',
							Period: 3600,
							StartTime: new Date(currentTime - 1000 * 3600).toISOString(),
							Statistics: ['Average'],
							Dimensions: [{
								Name: 'InstanceId',
								Value: grlsInstances[index1].instanceId
							}, ],
							Unit: 'Percent'
						};
						cloudwatch.getMetricStatistics(params, function(err, data) {
							if (err) throw err;
							var decayRate = 1;
							//set under-profile if CPUUtilization is less than 2% and over-profile if greater than 100%
							if(data.Datapoints[0].Average < 2/100){
								decayRate = uDecayRate;
							}else if(data.Datapoints[0].Average > 1){
								decayRate = oDecayRate;
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
					}			
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

//mark timed-out budgets and grlsInstances as invalid
var stopTimeBudget = function(timeBudget){
	var currentDate = new Date();
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
				//get the resourceId's of invalid budget
				getTimeBudgetInstances(timeBudget);
			});
		});
	});
}

//get all instances associated with a timeBudget
var getTimeBudgetInstances = function(timeBudget){
	mongoose.model('timeBudgets').find({
		timeBudgetName: timeBudget
	}).exec(function(err, budget){
		if(err) throw err;
		var batchType = budget.BatchType;
		var batchName = budget.BatchName;
		var startDate = budget.StartDate;
		var endDate = budget.EndDate;
		if (batchType == 'user') {
			mongoose.model('grlsLineItems').aggregate([{
				$match: {
					$and: [{
						time: {
							$gte: startDate
						}
					}, {
						time: {
							$lte: endDate
						}
					}, {
						user: batchName
					}, {
						group: 'null'
					}]
				}
			}, {
				$project: {
					_id: 0,
					instanceId: 1,
					serviceType: 1
				}
			}, {
				$group: {
					_id: '$serviceType',
					instanceId: {
                        $addToSet: "$instanceId"
                    }
				}
			}]).exec(function(e, serviceResources) {
				stopTimeBudgetInstances(serviceResources);
			});
		} else {
			mongoose.model('grlsLineItems').aggregate([{
				$match: {
					$and: [{
						time: {
							$gte: startDate
						}
					}, {
						time: {
							$lte: endDate
						}
					}, {
						group: batchName
					}]
				}
			}, {
				$project: {
					_id: 0,
					instanceId: 1,
					serviceType: 1
				}
			}, {
				$group: {
					_id: '$serviceType',
					instanceId: {
                        $addToSet: "$instanceId"
                    }
				}
			}]).exec(function(e, serviceResources) {
				stopTimeBudgetInstances(serviceResources);
			});
		}
	});
}

//stop all serviceResources of invalid budget
var stopTimeBudgetInstances = function(serviceResources){
	var index1 = 0;
    var controller1 = function() {
        iterator1(function() {
            index1++;
            if (index1 < serviceResources.length) controller1();
            else {

            }
        });
    };
    var iterator1 = function(callback1) {
        switch(serviceResources[index1]._id){
            case 'Amazon Elastic Compute Cloud':
                var resources = serviceResources[index1].ResourceId;
                var index2 = 0;
                var controller2 = function() {
                    iterator2(function() {
                        index2++;
                        if (index2 < resources.length) controller2();
                        else {
                            callback1();
                        }
                    });
                };
                var iterator2 = function(callback2) {
                    if(/^i-/.test(resources[index2])){
                        // the code to stop ec2 instances goes here
                        // instanceId is in resources[index2]
                        // console.log(resources[index2])
                        callback2();
                    }else{
                        callback2();
                    }                                      
                };
                controller2();
                break;
            case 'Amazon RDS Service':
                var resources = serviceResources[index1].ResourceId;
                var index2 = 0;
                var controller2 = function() {
                    iterator2(function() {
                        index2++;
                        if (index2 < resources.length) controller2();
                        else {
                            callback1();
                        }
                    });
                };
                var iterator2 = function(callback2) {
                    // the code to stop rds instances goes here
                    // rds resource arn is in resources[index2]
                    // console.log(resources[index2])
                    callback2();                                     
                };
                controller2();
                break;
            default:
                callback1();
                break;
        }
    };
    controller1();
}