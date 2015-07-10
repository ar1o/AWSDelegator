exports.budgets = function(req, res) {
	mongoose.model('Budgets').aggregate([{
		$project: {
			_id: 0,
			BudgetName: 1,
			BatchType: 1,
			BatchName: 1,
			StartDate: 1,
			EndDate: 1,
			Amount: 1
		}
	}]).exec(function(e, d) {
		res.send(d);
	});
}

exports.cost = function(req, res) {
	var batchType=req.query.batchType;
	var	batchName=req.query.batchName;
	var	startDate=req.query.startDate;
	var endDate=req.query.endDate;
	if (batchType == 'user') {
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				},{
					UsageStartDate: {
						$lte: endDate
					}
				},{
					'user:Name' : batchName
				},{
					'user:Group' : 'null'
				}]				
			}
		},{
			$project: {
				_id: 0,
				UsageStartDate: 1,
				Cost: 1
			}
		},{
            $group: {
                _id: "$UsageStartDate",
                Cost: {
                    $sum: "$Cost"
                }
            }
        },{
			$sort: {
				_id: 1
			}
		}]).exec(function(e, d) {
			res.send(d);
		});
	}else{
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				},{
					UsageStartDate: {
						$lte: endDate
					}
				},{
					'user:Group' : batchName
				}]	
			}
		},{
			$project: {
				_id: 0,
				UsageStartDate: 1,
				Cost: 1
			}
		},{
            $group: {
                _id: "$UsageStartDate",
                Cost: {
                    $sum: "$Cost"
                }
            }
        },{
			$sort: {
				_id: 1
			}
		}]).exec(function(e, d) {			
			res.send(d);
		});
	}
}

exports.userCost = function(req, res) {
	var userName=req.query.userName;
	var	batchName=req.query.batchName;
	var	startDate=req.query.startDate;
	var endDate=req.query.endDate;
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

exports.usage = function(req, res) {
	var batchType=req.query.batchType;
	var	batchName=req.query.batchName;
	var	startDate=req.query.startDate;
	var endDate=req.query.endDate;
	if (batchType == 'user') {
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				},{
					UsageStartDate: {
						$lte: endDate
					}
				},{
					'user:Name' : batchName
				},{
					'user:Group' : 'null'
				}]				
			}
		},{
			$project: {
				_id: 0,
				'user:Name': 1,
				Cost: 1
			}
		},{
            $group: {
                _id: '$user:Name',
                Total: {
                    $sum: "$Cost"
                }
            }
        }]).exec(function(e, d) {
			res.send(d);
		});
	}else{
		mongoose.model('Billings').aggregate([{
			$match: {
				$and: [{
					UsageStartDate: {
						$gte: startDate
					}
				},{
					UsageStartDate: {
						$lte: endDate
					}
				},{
					'user:Group' : batchName
				}]	
			}
		},{
			$project: {
				_id: 0,
				'user:Group': 1,
				'user:Name': 1,
				Cost: 1
			}
		},{
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

exports.groupServiceUsage = function(req, res) {
	var	batchName=req.query.batchName;
	var	startDate=req.query.startDate;
	var endDate=req.query.endDate;
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
		for(var i=0 in d){
			result[d[i]._id]={};
			result[d[i]._id]['total']=d[i].Total;
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
						'user:Group': batchName
					}, {
						'ProductName': d[index1]._id
					}]
				}
			}, {
				$project: {
					_id: 0,
					'Operation': 1,
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
				for(var i=0 in d2){
					_res[d2[i]._id]={};
					_res[d2[i]._id]['total']=d2[i].Total;
				}
				result[d[index1]._id]['operation']=_res;
				callback1();
			});
		};
		controller1();
	});
}

exports.userServiceUsage = function(req, res) {
	var	batchName=req.query.batchName;
	var	startDate=req.query.startDate;
	var endDate=req.query.endDate;
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
		for(var i=0 in d){
			result[d[i]._id]={};
			result[d[i]._id]['total']=d[i].Total;
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
					'Operation': 1,
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
				for(var i=0 in d2){
					_res[d2[i]._id]={};
					_res[d2[i]._id]['total']=d2[i].Total;
				}
				result[d[index1]._id]['operation']=_res;
				callback1();
			});
		};
		controller1();
	});
}