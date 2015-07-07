// The instances model where we manipulate the data from AWS
var BudgetModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('dataReady');
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
	}

	getBudgets: function() {
		var self = this;
		budgetCollection.reset();
		this.budget_result().done(function(result) {
			for (var r in result) {
				var data = new budgetModel({
					budgetName: result[i].BudgetName,
					batchType: result[i].BatchType,
					batchName: result[i].BatchName,
					startDate: result[i].StartDate,
					endDate: result[i].EndDate,
					amount: result[i].Amount
				});
				budgetCollection.add(data);
			}
			self.set('dataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
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

var budgetCollection = new BudgetCollection();