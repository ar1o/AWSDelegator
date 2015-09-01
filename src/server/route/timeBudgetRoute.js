/*
	Query all the time budgets that exist in the database
 */
exports.timeBudgets = function(req, res) {
	mongoose.model('timeBudgets').find().exec(function(e, d) {
		res.send(d);
	});
}

/*
	Query time bugets inorder to get the time they are decaying at
 */
exports.timeBudgetCost = function(req, res) {
	var batchType = req.query.batchType;
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
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
				time: 1,
				decayTime: 1
			}
		}, {
			$group: {
				_id: "$time",
				Cost: {
					$sum: "$decayTime"
				}
			}
		}, {
			$sort: {
				_id: 1
			}
		}]).exec(function(e, d) {
			// console.log('TIMEBUDGETCOST', d)
			res.send(d);
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
				time: 1,
				decayTime: 1
			}
		}, {
			$group: {
				_id: "$time",
				Cost: {
					$sum: "$decayTime"
				}
			}
		}, {
			$sort: {
				_id: 1
			}
		}]).exec(function(e, d) {
			res.send(d);
		});
	}
}

/*
	USAGE CHART LOL	
 */
exports.timeBudgetUsage = function(req, res) {
	var batchType = req.query.batchType;
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
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
				decayTime: 1,
				user: 1
			}
		}, {
			$group: {
				_id: '$user',
				Total: {
					$sum: "$decayTime"
				}
			}
		}]).exec(function(e, sum) {
			// console.log('USAGE CHART LOL', sum);
			res.send(sum);
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
				user: 1,
				decayTime: 1
			}
		}, {
			$group: {
				_id: '$user',
				Total: {
					$sum: "$decayTime"
				}
			}
		}]).exec(function(e, sum) {
			res.send(sum);
		});
	}
}

exports.groupUserTimeService = function(req, res) {
	var userName = req.query.userName;
	var groupName = req.query.groupName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
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
				user: userName
			}, {
				group: groupName
			}]
		}
	}, {
		$project: {
			_id: 0,
			serviceType: 1,
			decayTime: 1
		}
	}, {
		$group: {
			_id: '$serviceType',
			Total: {
				$sum: "$decayTime"
			}
		}
	}]).exec(function(e, d) {
		var result = {};
		for (var i = 0 in d) {
			result[d[i]._id] = {};
			result[d[i]._id]['total'] = d[i].Total;
		}
		var index1 = 0;
		var controller1 = function() {
			iterator1(function() {
				index1++;
				if (index1 < d.length) controller1();
				else {
					res.send(result);
				}
			});
		};
		var iterator1 = function(callback1) {
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
						user: userName
					}, {
						group: groupName
					}, {
						serviceType: d[index1]._id
					}]
				}
			}, {
				$project: {
					_id: 0,
					instanceId: 1,
					decayTime: 1
				}
			}, {
				$group: {
					_id: '$instanceId',
					Total: {
						$sum: "$decayTime"
					}
				}
			}]).exec(function(e, d2) {
				var _res = {}
				for (var i = 0 in d2) {
					_res[d2[i]._id] = {};
					_res[d2[i]._id]['total'] = d2[i].Total;
				}
				result[d[index1]._id]['resourceId'] = _res;
				if (d2.length != 0) {
					callback1();
				}
			});
		};
		if (d.length != 0) {
			controller1();
		} else {

		}
	});
}

exports.timeUserService = function(req, res) {
	var userName = req.query.userName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
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
				user: userName
			}, {
				group: 'null'
			}]
		}
	}, {
		$project: {
			_id: 0,
			serviceType: 1,
			decayTime: 1
		}
	}, {
		$group: {
			_id: '$serviceType',
			Total: {
				$sum: "$decayTime"
			}
		}
	}]).exec(function(e, d) {
		var result = {};
		for (var i = 0 in d) {
			result[d[i]._id] = {};
			result[d[i]._id]['total'] = d[i].Total;
		}
		var index1 = 0;
		var controller1 = function() {
			iterator1(function() {
				index1++;
				if (index1 < d.length) controller1();
				else {
					res.send(result);
				}
			});
		};
		var iterator1 = function(callback1) {
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
						user: userName
					}, {
						group: 'null'
					}, {
						serviceType: d[index1]._id
					}]
				}
			}, {
				$project: {
					_id: 0,
					instanceId: 1,
					decayTime: 1
				}
			}, {
				$group: {
					_id: '$instanceId',
					Total: {
						$sum: "$decayTime"
					}
				}
			}]).exec(function(e, d2) {
				var _res = {}
				for (var i = 0 in d2) {
					_res[d2[i]._id] = {};
					_res[d2[i]._id]['total'] = d2[i].Total;
				}
				result[d[index1]._id]['resourceId'] = _res;
				if (d2.length != 0) {
					callback1();
				}
			});
		};
		if (d.length != 0) {
			controller1();
		}

	});
}

exports.userTimeCost = function(req, res) {
	var userName = req.query.userName;
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
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
				user: userName
			}, {
				group: batchName
			}]
		}
	}, {
		$project: {
			_id: 0,
			time: 1,
			decayTime: 1
		}
	}, {
		$group: {
			_id: "$time",
			Cost: {
				$sum: "$decayTime"
			}
		}
	}, {
		$sort: {
			_id: 1
		}
	}]).exec(function(e, d) {
		// console.log('userTimeCost',d)
		res.send(d);
	});
}

/*
	Create a GRLS Instance when a time budget is created.
 */
exports.createGRLSInstances = function(timeBudget, callback) {
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		if (timeBudget.BatchType == 'user') {
			mongoose.model('Billings').aggregate([{
				$match: {
					$and: [{
						'user:Name': {
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
				if (e) throw e;
				if (resources.length == 0) {
					callback("error: no associated resources");
				} else {
					var index1 = 0;
					var controller1 = function() {
						iterator1(function() {
							index1++;
							if (index1 < resources.length) {
								controller1();
							} else {
								callback('success');
							}
						});
					};

					var iterator1 = function(callback1) {
						if (resources[index1].ProductName[0] == 'Amazon Elastic Compute Cloud') {
							mongoose.model('ec2Instances').aggregate([{
								$match: {
									Id: resources[index1]._id,
								}
							}]).exec(function(e, resourceData) {
								//if response is not empty, create document
								if (resourceData.length != 0) {
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
										timeout: timeBudget.timeout,
										state: 'valid'
									};
									db.collection('grlsInstances').insert(doc, function(err) {
										if (err) throw err;
										callback1();
									});
								} else {
									callback1();
								}
							});
						} else if (resources[index1].ProductName == 'Amazon RDS Service') {
							var arn = resources[index1]._id;
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
										user: timeBudget.BatchName,
										group: 'null',
										instanceRegion: resourceData[0].AvailabilityZone,
										serviceType: 'rds',
										minConnectionsLimit: resourceData[0].minDBConnections,
										maxConnectionsLimit: resourceData[0].maxDBConnections,
										lifetime: 0,
										uDecay: timeBudget.uDecayRate,
										oDecay: timeBudget.oDecayRate,
										timeout: timeBudget.timeout,
										state: 'valid'
									};
									db.collection('grlsInstances').insert(doc, function(err) {
										if (err) throw err;
										callback1();
									});
								} else {
									callback1();
								}
							});
						} else {
							callback1();
						}
					};
					controller1();
				}
			});
		} else {
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

					});
				};
				var iterator1 = function(callback1) {
					mongoose.model('Billings').aggregate([{
						$match: {
							$or: [{
								//class group
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
								//collabrative group
								$and: [{
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
								}]
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
						if (e) throw e;
						if (resources.length == 0) {
							callback('error: no associated resources');
							return;
						} else {
							//if result is not empty, conduct second query
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
								if (resources[index2].ProductName[0] == 'Amazon Elastic Compute Cloud') {
									mongoose.model('ec2Instances').aggregate([{
										$match: {
											Id: resources[index2]._id,
											// State: 'running'
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
													timeout: timeBudget.timeout,
													state: 'valid'
												};
												db.collection('grlsInstances').insert(doc, function(err) {
													if (err) throw err;
													callback();
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
												minConnectionsLimit: resourceData[0].minDBConnections,
												maxConnectionsLimit: resourceData[0].maxDBConnections,
												lifetime: 0,
												uDecay: timeBudget.uDecayRate,
												oDecay: timeBudget.oDecayRate,
												timeout: timeBudget.timeout,
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
						}
						if (resources.length != 0) {
							controller2();
						} else {
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