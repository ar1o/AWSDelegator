exports.budgets = function(req, res) {
	mongoose.model('Budgets').find().exec(function(e, d) {
		res.send(d);
	});
}
//Cost Budget Query
exports.cost = function(req, res) {
	var batchType = req.query.batchType;
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;

	   //  console.log(batchType);
    //     console.log(batchName);
    // console.log(startDate);
    // console.log(endDate);
	//If the budget is for a single user instance
	if (batchType == 'user') {
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				}, {
					UsageStartDate: {
						$lte: endDate
					}
				}, {
					'user:Name': batchName
				}, {
					'user:Group': 'null'
				}]
			}
		}, {
			$project: {
				_id: 0,
				UsageStartDate: 1,
				Cost: 1
			}
		}, {
			$group: {
				_id: "$UsageStartDate",
				Cost: {
					$sum: "$Cost"
				}
			}
		}, {
			$sort: {
				_id: 1
			}
		}]).exec(function(e, d) {
			res.send(d);
		});
	} else { // If group instead
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				}, {
					UsageStartDate: {
						$lte: endDate
					}
				}, {
					'user:Group': batchName
				}]
			}
		}, {
			$project: {
				_id: 0,
				UsageStartDate: 1,
				Cost: 1
			}
		}, {
			$group: {
				_id: "$UsageStartDate",
				Cost: {
					$sum: "$Cost"
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

exports.timeBudgetCost = function(req, res) {
	var batchType = req.query.batchType;
	console.log(batchType)
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
			console.log('d', d)
			res.send(d);
		});
	}
}

exports.userCost = function(req, res) {
	var userName = req.query.userName;
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	mongoose.model('Billings').aggregate([{
		$match: {
			$and: [{
				UsageStartDate: {
					$gte: startDate
				}
			}, {
				UsageStartDate: {
					$lte: endDate
				}
			}, {
				'user:Name': userName
			}, {
				'user:Group': batchName
			}]
		}
	}, {
		$project: {
			_id: 0,
			UsageStartDate: 1,
			Cost: 1
		}
	}, {
		$group: {
			_id: "$UsageStartDate",
			Cost: {
				$sum: "$Cost"
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
exports.getUsers = function (req, res) {
	var result;
    console.log("1");
    mongoose.model('ec2Instances').aggregate({
        $project : {'_id': 0, 'Name' : 1 } 
    }).exec(function(e, d) {
        console.log("2");
        console.log(d);
        result.append(d);
        mongoose.model('rdsInstance').aggregate({
            $project : {'_id': 0, 'Name' : 1 }
        }).exec(function(e, d) {
            console.log("3");
            console.log(d);
            result.append(d);
        })
    }).exec(function(e, d) {
    	console.log(d);
    	res.send(d);
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
		res.send(d);
	});
}

exports.usage = function(req, res) {
	var batchType = req.query.batchType;
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	if (batchType == 'user') {
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				}, {
					UsageStartDate: {
						$lte: endDate
					}
				}, {
					'user:Name': batchName
				}, {
					'user:Group': 'null'
				}]
			}
		}, {
			$project: {
				_id: 0,
				'user:Name': 1,
				Cost: 1
			}
		}, {
			$group: {
				_id: '$user:Name',
				Total: {
					$sum: "$Cost"
				}
			}
		}]).exec(function(e, d) {
			res.send(d);
		});
	} else {
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				}, {
					UsageStartDate: {
						$lte: endDate
					}
				}, {
					'user:Group': batchName
				}]
			}
		}, {
			$project: {
				_id: 0,
				'user:Group': 1,
				'user:Name': 1,
				Cost: 1
			}
		}, {
			$group: {
				_id: '$user:Name',
				Total: {
					$sum: "$Cost"
				}
			}
		}]).exec(function(e, d) {
			res.send(d);
		});
	}
}

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

exports.groupServiceUsage = function(req, res) {
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	mongoose.model('Billings').aggregate([{
		$match: {
			$and: [{
				UsageStartDate: {
					$gte: startDate
				}
			}, {
				UsageStartDate: {
					$lte: endDate
				}
			}, {
				'user:Group': batchName
			}]
		}
	}, {
		$project: {
			_id: 0,
			'ProductName': 1,
			Cost: 1
		}
	}, {
		$group: {
			_id: '$ProductName',
			Total: {
				$sum: "$Cost"
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
				if (index1 < d.length) {
					controller1();
				} else {
					res.send(result);
				}
			});
		};
		var iterator1 = function(callback1) {
			mongoose.model('Billings').aggregate([{
				$match: {
					$and: [{
						UsageStartDate: {
							$gte: startDate
						}
					}, {
						UsageStartDate: {
							$lte: endDate
						}
					}, {
						'user:Group': batchName
					}, {
						'ProductName': d[index1]._id
					}]
				}
			}, {
				$project: {
					_id: 0,
					Operation: 1,
					Cost: 1
				}
			}, {
				$group: {
					_id: '$Operation',
					Total: {
						$sum: "$Cost"
					}
				}
			}]).exec(function(e, d2) {
				if (e) console.log("ERROR LOL");
				var _res = {}
				for (var i = 0 in d2) {
					_res[d2[i]._id] = {};
					_res[d2[i]._id]['total'] = d2[i].Total;
				}
				result[d[index1]._id]['operation'] = _res;
				if (d2.length != 0) {
					callback1();
				}
			});
		};
		if (d.length != 0) {
			controller1();
		} else {
			res.send(result);
		}
	});
}

exports.userServiceUsage = function(req, res) {
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	mongoose.model('Billings').aggregate([{
		$match: {
			$and: [{
				UsageStartDate: {
					$gte: startDate
				}
			}, {
				UsageStartDate: {
					$lte: endDate
				}
			}, {
				'user:Name': batchName
			}, {
				'user:Group': 'null'
			}]
		}
	}, {
		$project: {
			_id: 0,
			ProductName: 1,
			Cost: 1
		}
	}, {
		$group: {
			_id: '$ProductName',
			Total: {
				$sum: "$Cost"
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
				if (index1 < d.length) {
					controller1();
				} else {
					console.log('RESULT', result);
					res.send(result);
				}
			});
		};
		
		var iterator1 = function(callback1) {
			mongoose.model('Billings').aggregate([{
				$match: {
					$and: [{
						UsageStartDate: {
							$gte: startDate
						}
					}, {
						UsageStartDate: {
							$lte: endDate
						}
					}, {
						'user:Name': batchName
					}, {
						'user:Group': 'null'
					}, {
						'ProductName': d[index1]._id
					}]
				}
			}, {
				$project: {
					_id: 0,
					Operation: 1,
					Cost: 1
				}
			}, {
				$group: {
					_id: '$Operation',
					Total: {
						$sum: "$Cost"
					}
				}
			}]).exec(function(e, d2) {
				var _res = {}
				for (var i = 0 in d2) {
					_res[d2[i]._id] = {};
					_res[d2[i]._id]['total'] = d2[i].Total;
				}
				result[d[index1]._id]['operation'] = _res;
				if (d2.length != 0) {
					callback1();
				}
			});
		}; //iterator1 end

		if (d.length != 0) {
			controller1();
		} else {
			res.send(result);
		}
	});
}

exports.groupUserService = function(req, res) {
	var userName = req.query.userName;
	var groupName = req.query.groupName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	mongoose.model('Billings').aggregate([{
		$match: {
			$and: [{
				UsageStartDate: {
					$gte: startDate
				}
			}, {
				UsageStartDate: {
					$lte: endDate
				}
			}, {
				'user:Name': userName
			}, {
				'user:Group': groupName
			}]
		}
	}, {
		$project: {
			_id: 0,
			ProductName: 1,
			Cost: 1
		}
	}, {
		$group: {
			_id: '$ProductName',
			Total: {
				$sum: "$Cost"
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
			mongoose.model('Billings').aggregate([{
				$match: {
					$and: [{
						UsageStartDate: {
							$gte: startDate
						}
					}, {
						UsageStartDate: {
							$lte: endDate
						}
					}, {
						'user:Name': userName
					}, {
						'user:Group': groupName
					}, {
						'ProductName': d[index1]._id
					}]
				}
			}, {
				$project: {
					_id: 0,
					ResourceId: 1,
					Cost: 1
				}
			}, {
				$group: {
					_id: '$ResourceId',
					Total: {
						$sum: "$Cost"
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

exports.userService = function(req, res) {
	var userName = req.query.userName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	mongoose.model('Billings').aggregate([{
		$match: {
			$and: [{
				UsageStartDate: {
					$gte: startDate
				}
			}, {
				UsageStartDate: {
					$lte: endDate
				}
			}, {
				'user:Name': userName
			}, {
				'user:Group': 'null'
			}]
		}
	}, {
		$project: {
			_id: 0,
			ProductName: 1,
			Cost: 1
		}
	}, {
		$group: {
			_id: '$ProductName',
			Total: {
				$sum: "$Cost"
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
			mongoose.model('Billings').aggregate([{
				$match: {
					$and: [{
						UsageStartDate: {
							$gte: startDate
						}
					}, {
						UsageStartDate: {
							$lte: endDate
						}
					}, {
						'user:Name': userName
					}, {
						'user:Group': 'null'
					}, {
						'ProductName': d[index1]._id
					}]
				}
			}, {
				$project: {
					_id: 0,
					ResourceId: 1,
					Cost: 1
				}
			}, {
				$group: {
					_id: '$ResourceId',
					Total: {
						$sum: "$Cost"
					}
				}
			}]).exec(function(e, d2) {
				var _res = {}
				for (var i = 0 in d2) {
					_res[d2[i]._id] = {};
					_res[d2[i]._id]['total'] = d2[i].Total;
				}
				result[d[index1]._id]['resourceId'] = _res;
				if (d2.length != 0)
					callback1();
			});
		};
		if (d.length != 0) {
			controller1();
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