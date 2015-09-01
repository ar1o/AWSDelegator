/*
	Get all the cost budgets
 */
exports.budgets = function(req, res) {
	mongoose.model('Budgets').find().exec(function(e, d) {
		res.send(d);
	});
}

/*
	Cost Budget Query
 */
exports.cost = function(req, res) {
	var batchType = req.query.batchType;
	var batchName = req.query.batchName;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;

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

/*
	Given user/group/start and end date get the total cost
 */
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

exports.getUsers = function(req, res) {
		var result;
		mongoose.model('ec2Instances').aggregate({
			$project: {
				'_id': 0,
				'Name': 1
			}
		}).exec(function(e, d) {
			result.append(d);
			mongoose.model('rdsInstance').aggregate({
				$project: {
					'_id': 0,
					'Name': 1
				}
			}).exec(function(e, d) {
				result.append(d);
			})
		}).exec(function(e, d) {
			res.send(d);
		});
	}

/*
	This query is used to find active users with instances.
	This is for creation of cost budget drop down. 

	This is such that it enables the client to only create
	quote budget profiles on most up-to-date group/resource changes. 
 */
exports.query_users = function(req, res) {
	var queried_users = [];
	mongoose.model('iamUsers').aggregate([{
		$project: {
			_id: 0,
			UserName: 1
		}
	}]).exec(function(e, d) {
		// console.log('query_users', d);
		// res.send(d[0].UserName);

		var index = 0;
		var date = new Date();
		date.setDate(date.getDate() - 7)
		// console.log(date.toISOString());

		var budgetController = function() {
			budgetIterator(function() {
				index++;
				if (index < d.length) {
					budgetController();
				} else {
					// console.log(queried_users);
					res.send(queried_users);
				}
			});
		};
		var budgetIterator = function(callback1) {
			var batchName = d[index].UserName

			mongoose.model('Billings').aggregate([{
				$match: {
					$and: [{
						UsageStartDate: {
							$gte: date.toISOString()
						}
					}, {
						// 	UsageStartDate: {
						// 		$lte: endDate
						// 	}
						// }, {
						'user:Name': batchName
					}, {
						'user:Group': 'null'
					}]
				}
			}, {
				$project: {
					_id: 0,
					'user:Name': 1
				}
			}, {
				$group: {
					_id: '$user:Name'
				}
			}]).exec(function(e, d) {
				if (d.length != 0) {
					//add this to an array or something
					// console.log('USAGE', d);
					queried_users.push(d[0]);
				}
				callback1();
			});
		};
		if (d.length != 0) {
			budgetController();
		}
	});;
}
/*
	This query aims to get the latest group that
	are linked to a resource id for the past week.

	This is such that it enables the client to only create
	quote budget profiles on most up-to-date group/resource changes. 
 */
exports.query_groups = function(req, res) {
	var queried_groups = [];
	mongoose.model('iamGroups').aggregate([{
		$project: {
			_id: 0,
			GroupName: 1
		}

	}]).exec(function(e, d) {
		// console.log('query_groups', d);
		// res.send(d[0].UserName);

		var index = 0;
		//Only query for the past 7 days. 
		var date = new Date();
		date.setDate(date.getDate() - 7)
		// console.log(date.toISOString());

		var budgetController = function() {
			budgetIterator(function() {
				index++;
				if (index < d.length) {
					budgetController();
				} else {
					// console.log(queried_groups);
					res.send(queried_groups);
				}
			});
		};
		var budgetIterator = function(callback1) {
			var batchName = d[index].GroupName

			mongoose.model('Billings').aggregate([{
				$match: {
					$and: [{
						UsageStartDate: {
							$gte: date.toISOString()
						}
					}, {
						// 	UsageStartDate: {
						// 		$lte: endDate
						// 	}
						// }, {
					// 	'user:Name': batchName
					// }, {
						'user:Group': batchName
					}]
				}
			}, {
				$project: {
					_id: 0,
					'user:Group': 1
					// 'user:Name': 1,
					// Cost: 1
				}
			}, {
				$group: {
					_id: '$user:Group',
				}
			}]).exec(function(e, d) {
				if (d.length != 0) {
					//add this to an array or something
					// console.log('USAGE GROUp', d);
					queried_groups.push(d[0]);
				}
				callback1();
			});
		};
		if (d.length != 0) {
			budgetController();
		}
	});;
}

/*
	Query cost of user or groups (progress bar chart)
 */
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
				// console.log('USAGE', d);
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
				// console.log("GROU SHIT", d);
				res.send(d);
			});
		}
	}

	/*
		Cost based on AWS products for users
	 */
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

/*
	Cost based on AWS products for groups
 */
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