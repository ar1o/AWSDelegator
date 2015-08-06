var UsageMonitorModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('dataReady');
		this.change('groupDataReady');
		this.change('budgetDataReady');
		this.change('timeBudgetDataReady');

		this.change('groupDataReady');
		this.change('userDataReady');
		this.change('postDataReady');

		this.change('budgetCostDataReady');
		this.change('budgetUsageDataReady');
		this.change('userBudgetCostDataReady');
		this.change('serviceDataReady');
		this.change('groupUserServiceDataReady');
	},
	groups_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/usage/groups',
			success: function(data) {
				result = data;
			}
		});
	},
	users_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'json',
			url: host + '/api/usage/users',
			success: function(data) {
				result = data;
				return result;
			}
		}).done(function(obj) {
			console.log(obj);
			return obj;
		});
	},
	budget_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/usage/budget',
			success: function(data) {
				result = data;
			}
		});
	},

	time_budget_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/usage/timeBudget',
			success: function(data) {
				result = data;
			}
		});
	},

	getGroups: function() {
		var self = this;
		GroupCollection.reset();
		this.groups_result().done(function(result) {
			for (var r in result) {
				var costBudgetNames = result[r].CostBudgetName[0];
				for (var i = 1; i < result[r].CostBudgetName.length; ++i) {
					costBudgetNames += ", " + result[r].CostBudgetName[i];
				}
				var timeBudgetNames = result[r].TimeBudgetName[0];
				for (var i = 1; i < result[r].TimeBudgetName.length; ++i) {
					timeBudgetNames += ", " + result[r].TimeBudgetName[i];
				}
				var data = new iamGroupsModel({
					name: result[r].GroupName,
					createDate: result[r].CreateDate,
					costBudgetNames: costBudgetNames,
					timeBudgetNames: timeBudgetNames
				});
				GroupCollection.add(data);
			}
			self.set('groupDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getUsers: function() {
		var self = this;
		UserCollection.reset();
		this.users_result().done(function(result) {
			for (var r in result) {
				var costBudgetNames = result[r].CostBudgetName[0];
				for (var i = 1; i < result[r].CostBudgetName.length; ++i) {
					costBudgetNames += ", " + result[r].CostBudgetName[i];
				}
				var timeBudgetNames = result[r].TimeBudgetName[0];
				for (var i = 1; i < result[r].TimeBudgetName.length; ++i) {
					timeBudgetNames += ", " + result[r].TimeBudgetName[i];
				}
				var data = new iamGroupsModel({
					name: result[r].UserName,
					createDate: result[r].CreateDate,
					costBudgetNames: costBudgetNames,
					timeBudgetNames: timeBudgetNames
				});
				UserCollection.add(data);
			}
			self.set('userDataReady', Date.now());
			return UserCollection;
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getBudgets: function() {
		console.log("getBudgets");
		var self = this;
		this.budget_result().done(function(result) {
			budgetCollection.reset();
			for (var r in result) {
				var data = new budgetModel({
					budgetName: result[r].BudgetName,
					batchType: result[r].BatchType,
					batchName: result[r].BatchName,
					startDate: result[r].StartDate,
					endDate: result[r].EndDate,
					amount: result[r].Amount,
					timeout: result[r].TimeOut
				});
				budgetCollection.add(data);
			}
			self.set('budgetDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getTimeBudgets: function() {
		var self = this;
		this.time_budget_result().done(function(result) {
			timeBudgetCollection.reset();
			for (var r in result) {
				var data = new timeBudgetModel({
					timeBudgetName: result[r].TimeBudgetName,
					batchType: result[r].BatchType,
					batchName: result[r].BatchName,
					startDate: result[r].StartDate,
					endDate: result[r].EndDate,
					timeAmount: result[r].TimeAmount,
					udecay: result[r].uDecayRate,
					odecay: result[r].oDecayRate,
					minDBConnections: result[r].minDBConnections,
					maxDBConnections: result[r].maxDBConnections,
					timeout: result[r].TimeOut
				});
				timeBudgetCollection.add(data);
			}
			self.set('timeBudgetDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	post_budget_result: function(data) {
		var self = this;
		//for comparison purposed. Remove when done. ^^
		return $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: host + '/budget',
			success: function(data) {
				self.getBudgets();
				self.set('postDataReady', Date.now());

			}
		});
	},

	post_time_budget_result: function(data) {
		var self = this;
		return $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: host + '/timebudget',
			success: function(data) {
				self.getTimeBudgets();
				self.set('postDataReady', Date.now());
			}
		});
	},
	edit_cost_budget: function (data) {
		var self = this;
		return $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: host + '/editCostBudget',
			success: function(data) {
				self.getTimeBudgets();
				self.set('postDataReady', Date.now());
			}
		});
	},

	remove_cost_budget: function(data) {
		//data == budget name
		// var name = JSON.stringify(data);
		var name = data.budgetName;
		var self = this;
		return $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: host + '/removeCostBudget',
			success: function(data) {
				self.getBudgets();
				console.log("Budget: "+name+" deleted!");
				self.set('postDataReady', Date.now());
			}
		});
	},

	getBudgetCostChart: function(budgetIndex) {
		var self = this;
		budgetCostCollection.reset();
		var params = {
			batchType: budgetCollection.at(budgetIndex).get('batchType'),
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		(function(params) {
			$.get(host + '/api/usage/budgetCost', params, function(result) {
				for (var i in result) {
					var data = new budgetCostModel({
						date: result[i]._id,
						cost: Math.round(result[i].Cost * 10000) / 10000
					});
					budgetCostCollection.add(data);
				}
				//add endDate into collection
				var data = new budgetCostModel({
					date: budgetCollection.at(budgetIndex).get('endDate'),
					cost: 0
				});
				budgetCostCollection.add(data);
				self.set('budgetCostDataReady', Date.now());
			});
		})(params);
	},

	getTimeBudgetCostChart: function(budgetIndex) {
		var self = this;
		budgetCostCollection.reset();
		var params = {
			batchType: timeBudgetCollection.at(budgetIndex).get('batchType'),
			batchName: timeBudgetCollection.at(budgetIndex).get('batchName'),
			startDate: timeBudgetCollection.at(budgetIndex).get('startDate'),
			endDate: timeBudgetCollection.at(budgetIndex).get('endDate')
		};
		(function(params) {
			$.get(host + '/api/usage/timeBudgetCost', params, function(result) {
				console.log(result)
				for (var i in result) {
					var data = new budgetCostModel({
						date: result[i]._id,
						cost: Math.round(result[i].Cost * 10000) / 10000
					});
					budgetCostCollection.add(data);
				}
				//add endDate into collection
				var data = new budgetCostModel({
					date: timeBudgetCollection.at(budgetIndex).get('endDate'),
					cost: 0
				});
				budgetCostCollection.add(data);
				self.set('budgetCostDataReady', Date.now());
			});
		})(params);
	},

	getBudgetUsageChart: function(budgetIndex) {
		var self = this;
		budgetUsageCollection.reset();
		totalBudgetCollection.reset();
		var params = {
			batchType: budgetCollection.at(budgetIndex).get('batchType'),
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		var budgetAmount = budgetCollection.at(budgetIndex).get('amount');
		(function(params) {
			$.get(host + '/api/usage/budgetUsage', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].Total;
				}
				for (var i in result) {
					var data = new budgetUsageModel({
						batchName: result[i]._id,
						usage: (result[i].Total * 100) / budgetAmount,
						total: total
					});
					budgetUsageCollection.add(data);
				}
				var data = new totalBudgetModel({
					usage: total / budgetAmount,
					total: total
				});
				totalBudgetCollection.add(data);
				self.set('budgetUsageDataReady', Date.now());
			});
		})(params);
	},

	getTimeBudgetUsageChart: function(budgetIndex) {
		var self = this;
		budgetUsageCollection.reset();
		totalBudgetCollection.reset();
		var params = {
			batchType: timeBudgetCollection.at(budgetIndex).get('batchType'),
			batchName: timeBudgetCollection.at(budgetIndex).get('batchName'),
			startDate: timeBudgetCollection.at(budgetIndex).get('startDate'),
			endDate: timeBudgetCollection.at(budgetIndex).get('endDate')
		};
		var budgetAmount = timeBudgetCollection.at(budgetIndex).get('timeAmount');
		(function(params) {
			$.get(host + '/api/usage/timeBudgetUsage', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].Total;
				}
				for (var i in result) {
					var data = new budgetUsageModel({
						batchName: result[i]._id,
						usage: (result[i].Total * 100) / budgetAmount,
						total: total
					});
					budgetUsageCollection.add(data);
				}
				var data = new totalBudgetModel({
					usage: total / budgetAmount,
					total: total
				});
				totalBudgetCollection.add(data);
				self.set('budgetUsageDataReady', Date.now());
			});
		})(params);
	},

	getUserCostBudget: function(budgetIndex, user) {
		var self = this;
		userBudgetCostCollection.reset();
		var params = {
			userName: user,
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		//add endDate into collection
		(function(params) {
			$.get(host + '/api/usage/userBudgetCost', params, function(result) {
				for (var i in result) {

					var data = new budgetCostModel({
						date: result[i]._id,
						cost: Math.round(result[i].Cost * 10000) / 10000
					});
					userBudgetCostCollection.add(data);
				}
				var data = new budgetCostModel({
					date: budgetCollection.at(budgetIndex).get('endDate'),
					cost: 0
				});
				userBudgetCostCollection.add(data);
				self.set('userBudgetCostDataReady', Date.now());
			});
		})(params);
	},

	getUserTimeCostBudget: function(budgetIndex, user) {
		var self = this;
		userBudgetCostCollection.reset();
		var params = {
			userName: user,
			batchName: timeBudgetCollection.at(budgetIndex).get('batchName'),
			startDate: timeBudgetCollection.at(budgetIndex).get('startDate'),
			endDate: timeBudgetCollection.at(budgetIndex).get('endDate')
		};
		//add endDate into collection
		(function(params) {
			$.get(host + '/api/usage/userTimeBudgetCost', params, function(result) {
				for (var i in result) {

					var data = new budgetCostModel({
						date: result[i]._id,
						cost: Math.round(result[i].Cost * 10000) / 10000
					});
					userBudgetCostCollection.add(data);
				}
				var data = new budgetCostModel({
					date: timeBudgetCollection.at(budgetIndex).get('endDate'),
					cost: 0
				});
				userBudgetCostCollection.add(data);
				self.set('userBudgetCostDataReady', Date.now());
			});
		})(params);
	},

	getGroupServiceUsageChart: function(budgetIndex) {
		var self = this;
		serviceCollection.reset();
		var params = {
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		(function(params) {
			$.get(host + '/api/usage/groupServiceUsage', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].total;
				}
				for (var i in result) {
					result[i]['percentage'] = (result[i].total / total) * 100;
					for (var j in result[i].operation) {
						result[i].operation[j]['percentage'] = (result[i].operation[j].total / total) * 100;
					}
				}
				var data = new serviceModel({
					batchName: params.batchName,
					services: result
				});
				serviceCollection.add(data);
				self.set('serviceDataReady', Date.now());
			});
		})(params);
	},

	getUserServiceUsageChart: function(budgetIndex) {
		var self = this;
		serviceCollection.reset();
		var params = {
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		(function(params) {
			$.get(host + '/api/usage/userServiceUsage', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].total;
				}
				for (var i in result) {
					result[i]['percentage'] = (result[i].total / total) * 100;
					for (var j in result[i].operation) {
						result[i].operation[j]['percentage'] = (result[i].operation[j].total / total) * 100;
					}
				}
				var data = new serviceModel({
					batchName: params.batchName,
					services: result
				});
				serviceCollection.add(data);
				self.set('serviceDataReady', Date.now());
			});
		})(params);
	},

	getGroupUserServiceUsageChart: function(user, budgetIndex) {
		var self = this;
		groupUserServiceCollection.reset();
		var params = {
			userName: user,
			groupName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate'),
		};

		(function(params) {
			$.get(host + '/api/usage/groupUserService', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].total;
				}
				for (var i in result) {
					result[i]['percentage'] = (result[i].total / total) * 100;
					for (var j in result[i].resourceId) {
						result[i].resourceId[j]['percentage'] = (result[i].resourceId[j].total / total) * 100;
					}
				}
				var data = new serviceModel({
					batchName: params.userName,
					services: result
				});
				groupUserServiceCollection.add(data);
				self.set('groupUserServiceDataReady', Date.now());
			});
		})(params);
	},

	getTimeGroupUserServiceUsageChart: function(user, budgetIndex) {
		var self = this;
		groupUserServiceCollection.reset();
		var params = {
			userName: user,
			groupName: timeBudgetCollection.at(budgetIndex).get('batchName'),
			startDate: timeBudgetCollection.at(budgetIndex).get('startDate'),
			endDate: timeBudgetCollection.at(budgetIndex).get('endDate'),
		};
		(function(params) {
			$.get(host + '/api/usage/groupUserTimeService', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].total;
				}
				for (var i in result) {
					result[i]['percentage'] = (result[i].total / total) * 100;
					for (var j in result[i].resourceId) {
						result[i].resourceId[j]['percentage'] = (result[i].resourceId[j].total / total) * 100;
					}
				}
				var data = new serviceModel({
					batchName: params.userName,
					services: result
				});
				groupUserServiceCollection.add(data);
				self.set('groupUserServiceDataReady', Date.now());
			});
		})(params);
	},

	getUserServiceUsageChart: function(budgetIndex) {
		var self = this;
		groupUserServiceCollection.reset();
		var params = {
			userName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate'),
		};

		(function(params) {
			$.get(host + '/api/usage/userService', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].total;
				}
				for (var i in result) {
					result[i]['percentage'] = (result[i].total / total) * 100;
					for (var j in result[i].resourceId) {
						result[i].resourceId[j]['percentage'] = (result[i].resourceId[j].total / total) * 100;
					}
				}
				var data = new serviceModel({
					batchName: params.userName,
					services: result
				});
				groupUserServiceCollection.add(data);
				self.set('groupUserServiceDataReady', Date.now());
			});
		})(params);
	},

	getTimeUserServiceUsageChart: function(budgetIndex) {
		var self = this;
		groupUserServiceCollection.reset();
		var params = {
			userName: timeBudgetCollection.at(budgetIndex).get('batchName'),
			startDate: timeBudgetCollection.at(budgetIndex).get('startDate'),
			endDate: timeBudgetCollection.at(budgetIndex).get('endDate'),
		};

		(function(params) {
			$.get(host + '/api/usage/timeUserService', params, function(result) {
				var total = 0;
				for (var i in result) {
					total += result[i].total;
				}
				for (var i in result) {
					result[i]['percentage'] = (result[i].total / total) * 100;
					for (var j in result[i].resourceId) {
						result[i].resourceId[j]['percentage'] = (result[i].resourceId[j].total / total) * 100;
					}
				}
				var data = new serviceModel({
					batchName: params.userName,
					services: result
				});
				groupUserServiceCollection.add(data);
				self.set('groupUserServiceDataReady', Date.now());
			});
		})(params);
	},

	setBudgetIndex: function(budgetIndex) {
		budgetIndexCollection.reset();
		var data = new budgetIndexModel({
			index: budgetIndex
		});
		budgetIndexCollection.add(data);
	}
});

var iamGroupsModel = Backbone.Model.extend({
	defaults: {
		GroupName: null,
		Arn: null,
		CreateDate: null,
		BudgetNames: null
	}
});

var GroupsCollection = Backbone.Collection.extend({
	model: iamGroupsModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var iamUsersModel = Backbone.Model.extend({
	defaults: {
		UserName: null,
		CreateDate: null,
		costBudgetNames: null,
		timeBudgetNames: null
	}
});

var UsersCollection = Backbone.Collection.extend({
	model: iamUsersModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var budgetModel = Backbone.Model.extend({
	defaults: {
		budgetName: 'null',
		batchType: 'null',
		batchName: 'null',
		startDate: 'null',
		endDate: 'null',
		amount: 'null',
		timeout: 'null'
	}
});

var BudgetCollection = Backbone.Collection.extend({
	model: budgetModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var timeBudgetModel = Backbone.Model.extend({
	defaults: {
		timeBudgetName: 'null',
		batchType: 'null',
		batchName: 'null',
		startDate: 'null',
		endDate: 'null',
		time: 'null',
		udecay: 'null',
		odecay: 'null',
		dbConnections: 'null',
		timeout: 'null'
	}
});

var TimeBudgetCollection = Backbone.Collection.extend({
	model: timeBudgetModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var budgetCostModel = Backbone.Model.extend({
	defaults: {
		date: null,
		cost: null,
	}
});

var BudgetCostCollection = Backbone.Collection.extend({
	model: budgetCostModel,
	initialize: function() {
		this.on('add', function(model) {});
	}
});

var budgetUsageModel = Backbone.Model.extend({
	defaults: {
		batchName: null,
		usage: null,
		total: null
	}
});

var BudgetUsageCollection = Backbone.Collection.extend({
	model: budgetUsageModel,
	initialize: function() {
		this.on('add', function(model) {});
	}
});

var serviceModel = Backbone.Model.extend({
	defaults: {
		batchName: null,
		services: null
	}
});

var ServiceCollection = Backbone.Collection.extend({
	model: serviceModel,
	initialize: function() {
		this.on('add', function(model) {});
	}
});

var budgetIndexModel = Backbone.Model.extend({
	defaults: {
		index: null
	}
});

var BudgetIndexCollection = Backbone.Collection.extend({
	model: budgetIndexModel,
	initialize: function() {
		this.on('add', function(model) {});
	}
})

var totalBudgetModel = Backbone.Model.extend({
	defaults: {
		usage: null,
		total: null
	}
});

var TotalBudgetCollection = Backbone.Collection.extend({
	model: totalBudgetModel,
	initialize: function() {
		this.on('add', function(model) {});
	}
})

var totalBudgetCollection = new TotalBudgetCollection();
var budgetIndexCollection = new BudgetIndexCollection();
var serviceCollection = new ServiceCollection();
var groupUserServiceCollection = new ServiceCollection();
var budgetUsageCollection = new BudgetUsageCollection();
var userBudgetCostCollection = new BudgetUsageCollection();
var budgetCostCollection = new BudgetCostCollection();
var budgetCollection = new BudgetCollection();
var timeBudgetCollection = new TimeBudgetCollection();
var GroupCollection = new GroupsCollection();
var UserCollection = new UsersCollection();