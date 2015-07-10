var UsageMonitorModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('dataReady');
		this.change('groupDataReady');
		this.change('budgetDataReady');

		this.change('groupDataReady');
		this.change('userDataReady');
		this.change('postDataReady');

		this.change('budgetCostDataReady');
		this.change('budgetUsageDataReady');
		this.change('userBudgetCostDataReady');
		this.change('serviceDataReady');

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
			contentType: 'plain/text',
			url: host + '/api/usage/users',
			success: function(data) {
				result = data;
			}
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

	getGroups: function() {
		var self = this;
		GroupCollection.reset();
		this.groups_result().done(function(result) {
			for (var r in result) {
				var budgetNames = result[r].BudgetName[0];
				for(var i=1;i<result[r].BudgetName.length;++i){
					budgetNames+=", "+result[r].BudgetName[i];
				}
				var data = new iamGroupsModel({
					name: result[r].GroupName,
					arn: result[r].Arn,
					createDate: result[r].CreateDate,
					budgetNames: budgetNames
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

				var budgetNames = result[r].BudgetName[0];
				for(var i=1;i<result[r].BudgetName.length;++i){
					budgetNames+=", "+result[r].BudgetName[i];
				}
				var data = new iamUsersModel({
					name: result[r].UserName,
					arn: result[r].Arn,
					createDate: result[r].CreateDate,
					budgetNames: budgetNames
				});
				UserCollection.add(data);
			}
			self.set('userDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getBudgets: function() {
		var self = this;
		budgetCollection.reset();
		this.budget_result().done(function(result) {
			for (var r in result) {
				var data = new budgetModel({
					budgetName: result[r].BudgetName,
					batchType: result[r].BatchType,
					batchName: result[r].BatchName,
					startDate: result[r].StartDate,
					endDate: result[r].EndDate,
					amount: result[r].Amount
				});
				budgetCollection.add(data);
			}
			self.set('budgetDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	post_budget_result: function(data) {
		console.log('wtf', data);
		var self = this;
		return $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://localhost:3000/budget',
			success: function(data) {
				console.log(data);
				self.set('postDataReady', Date.now());

			}
		});
	},

	getBudgetCostChart: function(budgetIndex){
		var self = this;
		budgetCostCollection.reset();
		var params = {
			batchType: budgetCollection.at(budgetIndex).get('batchType'),
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		//add endDate into collection
		(function(params) {
			$.get(host+'/api/usage/budgetCost', params, function(result) {
				for (var i in result) {
					var data = new budgetCostModel({
						date: result[i]._id,
						cost: Math.round(result[i].Cost*10000)/10000
					});
					budgetCostCollection.add(data);
				}
				var data = new budgetCostModel({
					date: budgetCollection.at(budgetIndex).get('endDate'),
					cost: 0
				});
				budgetCostCollection.add(data);
				self.set('budgetCostDataReady', Date.now());
			});
		})(params);
	},

	getBudgetUsageChart: function(budgetIndex){
		var self = this;
		budgetUsageCollection.reset();
		var params = {
			batchType: budgetCollection.at(budgetIndex).get('batchType'),
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		var budgetAmount = budgetCollection.at(budgetIndex).get('amount');
		(function(params) {
			$.get(host+'/api/usage/budgetUsage', params, function(result) {
				var total = 0;
				for(var i in result){
					total += result[i].Total;
				}
				for (var i in result) {
					var data = new budgetUsageModel({
						batchName: result[i]._id,
						usage: (result[i].Total*100)/budgetAmount,
						total: total
					});
					budgetUsageCollection.add(data);
				}
				self.set('budgetUsageDataReady', Date.now());
			});
		})(params);
	},

	getUserCostBudget: function(budgetIndex,user){
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
			$.get(host+'/api/usage/userBudgetCost', params, function(result) {
				for (var i in result) {

					var data = new budgetCostModel({
						date: result[i]._id,
						cost: Math.round(result[i].Cost*10000)/10000
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

	getGroupServiceUsageChart: function(budgetIndex){
		var self = this;
		serviceCollection.reset();
		var params = {
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		(function(params) {
			$.get(host+'/api/usage/groupServiceUsage', params, function(result) {
				var total = 0;
				for(var i in result){
					total += result[i].total;
				}
				for(var i in result){
					result[i]['percentage'] = (result[i].total/total)*100;
					for(var j in result[i].operation){
						result[i].operation[j]['percentage'] = (result[i].operation[j].total/total)*100;
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

	getUserServiceUsageChart: function(budgetIndex){
		var self = this;
		serviceCollection.reset();
		var params = {
			batchName: budgetCollection.at(budgetIndex).get('batchName'),
			startDate: budgetCollection.at(budgetIndex).get('startDate'),
			endDate: budgetCollection.at(budgetIndex).get('endDate')
		};
		(function(params) {
			$.get(host+'/api/usage/userServiceUsage', params, function(result) {
				var total = 0;
				for(var i in result){
					total += result[i].total;
				}
				for(var i in result){
					result[i]['percentage'] = (result[i].total/total)*100;
					for(var j in result[i].operation){
						result[i].operation[j]['percentage'] = (result[i].operation[j].total/total)*100;
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
		Arn: null,
		CreateDate: null,
		BudgetNames: null
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
		budgetName: null,
		batchType: null,
		batchName: null,
		startDate: null,
		endDate: null,
		amount: 0
	}
});

var BudgetCollection = Backbone.Collection.extend({
	model: budgetModel,
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
		this.on('add', function(model) {
		});
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
		this.on('add', function(model) {
		});
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
		this.on('add', function(model) {
		});
	}
});

var serviceCollection = new ServiceCollection();
var budgetUsageCollection = new BudgetUsageCollection();
var userBudgetCostCollection = new BudgetUsageCollection();
var budgetCostCollection = new BudgetCostCollection();
var budgetCollection = new BudgetCollection();
var GroupCollection = new GroupsCollection();
var UserCollection = new UsersCollection();