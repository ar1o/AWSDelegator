exports.timeBudgets = function(req, res) {
	mongoose.model('timeBudgets').find().exec(function(e, d) {
		res.send(d);
	});
}

exports.createGRLSInstances = function(timeBudget) {
	MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        console.log(timeBudget)      
		if(timeBudget.BatchType == 'user'){
			mongoose.model('Billings').aggregate([
				{
					$match: {
						$and: [{
							'user:Name': {
								$eq: timeBudget.BatchName
							}
						}, {
							'user:Group': {
								$eq: 'null'
							}
						}, {
							UsageStartDate: {
								$gte: timeBudget.StartDate
							}
						}, {
							UsageStartDate: {
								$lte: timeBudget.EndDate
							}
						}],
					}
				}, {
	                $project: {
	                    _id: 0,
	                    ResourceId: 1,
	                    ProductName: 1
	                }
	            },{
	                $group: {
	                    _id: "$ResourceId",
	                    ProductName: {
	                        $addToSet: "$ProductName"
	                    }
	                }
	            },{
	                $project: {
	                    _id: 1,
	                    ProductName: 1
	                }
	            }
	        ]).exec(function(e, resources) {
				var index1 = 0;
				var controller1 = function() {
					iterator1(function() {
						index1++;
						if (index1 < resources.length) controller1();
						else {

						}
					});
				};
				var iterator1 = function(callback1) {
					if(resources[index1].ProductName[0] == 'Amazon Elastic Compute Cloud'){
						mongoose.model('ec2Instances').aggregate([{
							$match: {
								Id: resources[index1]._id,
								State: 'running'
							}
						}]).exec(function(e, resourceData) {
							if(resourceData.length != 0){
								var doc = {
									timeBudgetName: timeBudget.TimeBudgetName,
									instanceId: resourceData[0].Id,
									instanceType: resourceData[0].Type,
									user: timeBudget.BatchName,
									group: 'null',
									instanceRegion: resourceData[0].Zone,
									serviceType: 'ec2',
									instanceType: resourceData[0].Type,
									lifetime: 0,
									uDecay: timeBudget.uDecayRate,
									oDecay: timeBudget.oDecayRate,
									state: 'valid'
								};
								db.collection('grlsInstances').insert(doc, function(err) {
									if (err) throw err;
									callback1();
								});
							}else{
								callback1();
							}
						});
					}else if(resources[index1].ProductName == 'Amazon RDS Service'){
						var arn = resources[index1]._id;
						var dbName = arn.substring(arn.lastIndexOf(':')+1,arn.length);
						mongoose.model('rdsInstances').aggregate([{
							$match: {
								DBName: dbName
							}
						}]).exec(function(e, resourceData) {
							if(resourceData.length != 0){
								var doc = {
									timeBudgetName: timeBudget.TimeBudgetName,
									instanceId: resourceData[0].DBName,
									user: timeBudget.BatchName,
									group: 'null',
									instanceRegion: resourceData[0].AvailabilityZone,
									serviceType: 'rds',
									dBConnections: timeBudget.dBConnections,
									lifetime: 0,
									uDecay: timeBudget.uDecayRate,
									oDecay: timeBudget.oDecayRate,
									state: 'valid'
								};
								db.collection('grlsInstances').insert(doc, function(err) {
									if (err) throw err;
									callback1();
								});
							}else{
								callback1();
							}
						});
					}else{
						callback1();
					}
				};
				controller1();
	        });
		}else{
			mongoose.model('iamUsersGroups').aggregate([{
				$match: {
					GroupName: timeBudget.BatchName
				}
			}, {
				$project: {
					_id: 0,
					GroupName: 1,
					UserName: 1
				}
			}, {
				$group: {
					_id: "$GroupName",
					UserNames: {
						$addToSet: "$UserName"
					}
				}
			}, {
				$project: {
					_id: 0,
					UserNames: 1
				}
			}]).exec(function(e, query1) {
				var index1 = 0;
				query1[0].UserNames.push('null');
				var controller1 = function() {
					iterator1(function() {
						index1++;
						if (index1 < query1[0].UserNames.length) controller1();
						else {

						}
					});
				};
				var iterator1 = function(callback1) {
					mongoose.model('Billings').aggregate([{
						$match: {
							$and: [{
								'user:Name': {
									$eq: query1[0].UserNames[index1]
								}
							}, {
								'user:Group': {
									$eq: timeBudget.BatchName
								}
							}, {
								UsageStartDate: {
									$gte: timeBudget.StartDate
								}
							}, {
								UsageStartDate: {
									$lte: timeBudget.EndDate
								}
							}],
						}
					}, {
						$project: {
							_id: 0,
							ResourceId: 1,
							ProductName: 1
						}
					}, {
						$group: {
							_id: "$ResourceId",
							ProductName: {
								$addToSet: "$ProductName"
							}
						}
					}, {
						$project: {
							_id: 1,
							ProductName: 1
						}
					}]).exec(function(e, resources) {
						if(e) throw e;
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
							if (resources[index2].ProductName[0] == 'Amazon Elastic Compute Cloud') {
								mongoose.model('ec2Instances').aggregate([{
									$match: {
										Id: resources[index2]._id,
										State: 'running'
									}
								}]).exec(function(e, resourceData) {
									if (resourceData.length != 0) {
										if (/^t2/.test(resourceData[0].Type)) {
											var doc = {
												timeBudgetName: timeBudget.TimeBudgetName,
												instanceId: resourceData[0].Id,
												user: query1[0].UserNames[index1],
												group: timeBudget.BatchName,
												instanceRegion: resourceData[0].Zone,
												serviceType: 'ec2',
												instanceType: resourceData[0].Type,
												lifetime: 0,
												uDecay: timeBudget.uDecayRate,
												oDecay: timeBudget.oDecayRate,
												state: 'valid'
											};
											db.collection('grlsInstances').insert(doc, function(err) {
												if (err) throw err;
												callback2();
											});
										} else {
											callback2();
										}
									} else {
										callback2();
									}
								});
							} else if (resources[index2].ProductName == 'Amazon RDS Service') {
								var arn = resources[index2]._id;
								var dbName = arn.substring(arn.lastIndexOf(':') + 1, arn.length);
								mongoose.model('rdsInstances').aggregate([{
									$match: {
										DBName: dbName
									}
								}]).exec(function(e, resourceData) {
									if (resourceData.length != 0) {
										var doc = {
											timeBudgetName: timeBudget.TimeBudgetName,
											instanceId: resourceData[0].DBName,
											user: query1[0].UserNames[index1],
											group: timeBudget.BatchName,
											instanceRegion: resourceData[0].AvailabilityZone,
											serviceType: 'rds',
											dBConnections: timeBudget.dBConnections,
											lifetime: 0,
											uDecay: timeBudget.uDecayRate,
											oDecay: timeBudget.oDecayRate,
											state: 'valid'
										};
										db.collection('grlsInstances').insert(doc, function(err) {
											if (err) throw err;
											callback2();
										});
									} else {
										callback2();
									}
								});
							} else {
								callback2();
							}
						};
						if(resources.length!=0){
							controller2();			
						}else{
							callback1();
						}			
					});
				};
				if (query1.length != 0) {
					controller1();
				}
			});
		}
	});
}