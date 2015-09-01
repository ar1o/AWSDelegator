/**
	This file contains most of the algorithm and logic for determining under budget/over budget profiles.
	GRLS = Graduated Resource Limitation System.
	GRLS is only implemented for RDS and EC2 product. 
 **/

/*
	Update GRLS code starts here.
 */
exports.updateTimeBudgets = function() {
	getTimeAmount();
}

/*
	Query max TimeAmount for each instance, this result is used later 
	to identify budget timeout
 */
var getTimeAmount = function() {
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		var maxBudgetLifetimes = {};
		mongoose.model('timeBudgets').find({
			State: 'valid'
		}).exec(function(err, timeBudgets) {
			// console.log("getTimeAmount response", timeBudgets);
			if (err) throw err;
			//keep an index of the timebudgets iterated through
			var index1 = 0;

			//main function to loop through time budgets and create a hashmap based on timebudgetNames
			var controller1 = function() {
				iterator1(function() {
					index1++;
					if (index1 < timeBudgets.length) {
						controller1();
					} else {
						//when all the timebudgets have been added to the hashmap call the updateLifeTime() function
						updateLifetime(maxBudgetLifetimes);
					}
				});
			};

			//add the time amount to the maxBudgetLifeTimes hashmap then callback to the main function
			var iterator1 = function(callback1) {
				maxBudgetLifetimes[timeBudgets[index1].TimeBudgetName] = timeBudgets[index1].TimeAmount;
				callback1();
			};

			//only go into main function if there exists timebudgets
			if (timeBudgets.length > 0) {
				controller1();
			}
		});
	});
}

/*
	update lifetime of instances based on their usage-profile
 */
var updateLifetime = function(maxBudgetLifetimes) {
		MongoClient.connect(databaseUrl, function(err, db) {
			if (err) throw err;
			var currentDate = new Date();
			var currentTime = currentDate.getTime();
			var currentTimeIso = new Date(currentTime).toISOString();
			var date = currentTimeIso.split('T');
			date[1] = date[1].substring(0, date[1].lastIndexOf('.'));
			var date = date[0] + " " + date[1];
			var t2HourlyEarning = {
				't2.micro': 6,
				't2.small': 12,
				't2.medium': 24,
				't2.large': 36
			};
			//some random hashmap
			var budgetLifetimes = {};
			mongoose.model('timeBudgets').aggregate([{
				$match: {
					State: {
						$eq: 'valid'
					},
					// StartDate < currentDate < EndDate -- WHY?!
					StartDate: {
						$lte: date
					},
					EndDate: {
						$gte: date
					}
				}
			}]).exec(function(err, budgets) {
				// console.log('budgets', budgets)
				var index1 = 0;
				//controller function that calls the iterator to loop through something
				var timeBudgetsController = function() {
					timeBudgetsIterator(function() {
						index1++;
						//Check if the index is still smaller than the number of timeBudgets
						// console.log('index1', index1);
						if (index1 < budgets.length) {
							timeBudgetsController();
						} else {
							for (var budget in budgetLifetimes) {
								if (budgetLifetimes[budget] >= maxBudgetLifetimes[budget]) {
									stopTimeBudget(budget);
								}
							}
						}
					});
				};

				var timeBudgetsIterator = function(callback1) {
					var timeBudgetName = budgets[index1].TimeBudgetName;
					// console.log("timeBudgetName",timeBudgetName)
					mongoose.model('grlsInstances').find({
						timeBudgetName: timeBudgetName
					}).exec(function(e, grlsInstances) {
						// console.log('grlsInstances', grlsInstances);
						var index2 = 0;
						var grlsInstancesController = function() {
							grlsInstancesIterator(function() {
								index2++;
								if (index2 < grlsInstances.length) {
									grlsInstancesController();
								} else {
									callback1();
								}
							});
						};

						var grlsInstancesIterator = function(callback2) {
							var instanceId = grlsInstances[index2].instanceId;
							var serviceType = grlsInstances[index2].serviceType;
							var instanceType = grlsInstances[index2].instanceType;
							var instanceRegion = grlsInstances[index2].instanceRegion;
							var maxConnectionsLimit = grlsInstances[index2].maxConnectionsLimit;
							var minConnectionsLimit = grlsInstances[index2].minConnectionsLimit;
							var uDecayRate = grlsInstances[index2].uDecay;
							var oDecayRate = grlsInstances[index2].oDecay;
							var lifetime = grlsInstances[index2].lifetime;
							var user = grlsInstances[index2].user;
							var group = grlsInstances[index2].group;
							AWS.config.region = instanceRegion.substring(0, instanceRegion.length - 1);
							var cloudwatch = new AWS.CloudWatch();

							switch (serviceType) {
								case 'ec2':
									//if t2 instance then use CPUCreditBalance for profiling-
									//if slope of credit balance is equal to max allowed usage limit 
									//for that instance type or 0 then apply under-profile decay rate,
									//if slope is 0 and credit balance is 0 then apply over-profile decay rate,
									//else check set to under-profile if under 2% CPUUtilization 
									//and over-profile if greater than 100%
									if (/^t2/.test(instanceType)) {
										var params = {
											EndTime: currentTimeIso,
											MetricName: 'CPUCreditBalance',
											Namespace: 'AWS/EC2',
											Period: 3600,
											StartTime: new Date(currentTime - 1000 * 3600 * 2).toISOString(),
											Statistics: ['Average'],
											Dimensions: [{
												Name: 'InstanceId',
												Value: instanceId
											}, ],
											Unit: 'Count'
										};
										cloudwatch.getMetricStatistics(params, function(err, cloudwatchData) {
											// console.log('cloudwatchdata', cloudwatchData);
											if (cloudwatchData.Datapoints[1] == undefined || cloudwatchData.Datapoints[0] == undefined) {
												//do nothing
												console.log("do nothing");
											} else {
												if (err) throw err;
												var decayRate = 1;
												var slope = cloudwatchData.Datapoints[1].Average - cloudwatchData.Datapoints[0].Average;
												var maxCredits = t2HourlyEarning[instanceType] * 24;
												if (slope < 1) {
													if ((maxCredits - cloudwatchData.Datapoints[1].Average) < 0.1) {
														decayRate = uDecayRate;
													} else if (cloudwatchData.Datapoints[1].Average < (0.02 * maxCredits)) {
														decayRate = oDecayRate;
													}
												} else if ((t2HourlyEarning[instanceType] - slope) < 0.1) {
													decayRate = uDecayRate;
												}
												if (!(timeBudgetName in budgetLifetimes)) {
													budgetLifetimes[timeBudgetName] = 0;
												}
												budgetLifetimes[timeBudgetName] += lifetime + decayRate;

												mongoose.model('grlsInstances').update({
													timeBudgetName: timeBudgetName,
													instanceId: instanceId
												}, {
													$set: {
														lifetime: lifetime + decayRate
													}
												}).exec(function(err) {
													if (err) throw err;
													db.collection('grlsLineItems').insert({
														instanceId: instanceId,
														user: user,
														group: group,
														serviceType: serviceType,
														decayTime: decayRate,
														time: currentTimeIso,
														zone: instanceRegion
													}, function(err) {
														if (err) throw err;
														callback2();
													});
												});
											}
										});
									} else {
										var params = {
											EndTime: currentTimeIso,
											MetricName: 'CPUUtilization',
											Namespace: 'AWS/EC2',
											Period: 3600,
											StartTime: new Date(currentTime - 1000 * 3600).toISOString(),
											Statistics: ['Average'],
											Dimensions: [{
												Name: 'InstanceId',
												Value: instanceId
											}, ],
											Unit: 'Percent'
										};
										cloudwatch.getMetricStatistics(params, function(err, cloudwatchData) {
											if (err) throw err;
											var decayRate = 1;
											//set under-profile if CPUUtilization is less than 2% and over-profile if greater than 100%
											if (cloudwatchData.Datapoints[0].Average < 2 / 100) {
												decayRate = uDecayRate;
											} else if (cloudwatchData.Datapoints[0].Average > 1) {
												decayRate = oDecayRate;
											}
											if (!(timeBudgetName in budgetLifetimes)) {
												budgetLifetimes[timeBudgetName] = 0;
											}
											budgetLifetimes[timeBudgetName] += lifetime + decayRate;
											mongoose.model('grlsInstances').update({
												timeBudgetName: timeBudgetName,
												instanceId: instanceId
											}, {
												$set: {
													lifetime: lifetime + decayRate
												}
											}).exec(function(err) {
												if (err) throw err;
												db.collection('grlsLineItems').insert({
													instanceId: instanceId,
													user: user,
													group: group,
													serviceType: serviceType,
													decayTime: decayRate,
													time: currentTimeIso,
													zone: instanceRegion
												}, function(err) {
													if (err) throw err;
													callback2();
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
											Value: instanceId
										}, ],
										Unit: 'Count'
									};
									cloudwatch.getMetricStatistics(params, function(err, cloudwatchData) {
										if (err) throw err;
										var decayRate = 1;
										if (cloudwatchData.Datapoints[0].Average < minConnectionsLimit) {
											decayRate = uDecayRate;
										} else if (cloudwatchData.Datapoints[0].Average > maxConnectionsLimit) {
											decayRate = oDecayRate;
										}
										if (!(timeBudgetName in budgetLifetimes)) {
											budgetLifetimes[timeBudgetName] = 0;
										}
										budgetLifetimes[timeBudgetName] += lifetime + decayRate;
										var zone = instanceRegion;
										zone = zone.substring(0, zone.length - 1);
										var arn = 'arn:aws:rds:' + zone + ':' + awsAccountNumber + ':db:' + instanceId;
										mongoose.model('grlsInstances').update({
											timeBudgetName: timeBudgetName,
											instanceId: instanceId
										}, {
											$set: {
												lifetime: lifetime + decayRate
											}
										}).exec(function(err) {
											if (err) throw err;
											db.collection('grlsLineItems').insert({
												instanceId: arn,
												user: user,
												group: group,
												serviceType: serviceType,
												decayTime: decayRate,
												time: currentTimeIso,
												zone: instanceRegion
											}, function(err) {
												if (err) throw err;
												callback2();
											});
										});
									});
									break;
								default:
									callback2();
									break;
							}; //end of switch cases
						}; //end of iterator2
						if (grlsInstances.length != 0) {
							grlsInstancesController();
						}
						// else {
						// console.log('grlsInstances is empty');
						// }
					}); //end of grlsLineItem find query
				}; //end of iterator1
				if (budgets.length != 0) {
					timeBudgetsController();
				}
			}); //end of timeBudgets query
		}); //end of mongoDB connection call
	} //end of updateLifetime function


/*
	mark timed-out budgets and grlsInstances as invalid
 */
var stopTimeBudget = function(timeBudget) {
	MongoClient.connect(databaseUrl, function(err, db) {

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
			}, {
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
					//get the resourceId's of invalid budget in-order to stop them
					mongoose.model('timeBudgets').find({
						TimeBudgetName: timeBudget
					}).exec(function(err, budget) {
						if (budget[0].TimeOut == 'true') {
							getTimeBudgetInstances(timeBudget);
						}
					});
				});
			});
		});
	});
}

/*
	Query all instances associated with a timeBudget
 */
var getTimeBudgetInstances = function(timeBudget) {
	mongoose.model('timeBudgets').find({
		TimeBudgetName: timeBudget
	}).exec(function(err, budget) {
		if (err) throw err;
		var batchType = budget[0].BatchType;
		var batchName = budget[0].BatchName;
		var startDate = budget[0].StartDate;
		var endDate = budget[0].EndDate;
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
					serviceType: 1,
					zone: 1
				}
			}, {
				$group: {
					_id: '$serviceType',
					instanceId: {
						$addToSet: "$instanceId"
					},
					region: {
						$addToSet: "$zone"
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

/*
	Stop all serviceResources of invalid budget
 */
var stopTimeBudgetInstances = function(serviceResources) {
	var index1 = 0;
	var controller1 = function() {
		iterator1(function() {
			index1++;
			if (index1 < serviceResources.length) {
				controller1();
			} else {

			}
		});
	};
	var iterator1 = function(callback1) {
		switch (serviceResources[index1]._id) {
			case 'ec2':
				var resources = serviceResources[index1].instanceId;
				var zone = serviceResources[index1].region;
				var index2 = 0;
				var controller2 = function() {
					iterator2(function() {
						index2++;
						if (index2 < resources.length) {
							controller2();
						} else {
							callback1();
						}
					});
				};
				var iterator2 = function(callback2) {
					if (/^i-/.test(resources[index2])) {
						// the code to stop ec2 instances goes here
						// instanceId is in resources[index2]
						var instanceZone = zone[index2].substring(0, 9);
						//     callback1();    
						ec2 = new AWS.EC2({
							region: instanceZone
						});

						var params = {
							InstanceIds: [resources[index2]]
								// DryRun: true
								// Force: true || false
						};

						ec2.stopInstances(params, function(err, data) {
							if (err) console.log(err, err.stack); // an error occurred
							else console.log("Stopping timeBudget!!", data); // successful response
						});

						callback2();
					} else {
						callback2();
					}
				};
				controller2();
				break;
			case 'rds':
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
					console.log(resources[index2])
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