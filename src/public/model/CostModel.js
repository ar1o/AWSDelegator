var CostModel = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		this.change('dataReady');
	},
	getEC2Cost: function(product) {
		hourlyCostCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			productName: product
		};
		(function(params) {
			$.get(host+'/api/billing/hourlyCostProduct', params, function(result) {
				for (var i in result) {
					var data = new Cost({
						date: result[i]._id,
						cost: result[i].Total
					});
					hourlyCostCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	},
	getRDSCost: function(product) {
		hourlyCostCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			productName: product
		};
		(function(params) {
			$.get(host+'/api/billing/rds/hourlyCostProduct', params, function(result) {
				for (var i in result) {
					var data = new Cost({
						date: result[i]._id,
						cost: result[i].Total
					});
					hourlyCostCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	},

	getAWSMonthlyCost: function() {
		AWSMonthlyCost.reset();
		var self = this;
		(function() {
			$.get(host + '/api/billing/groupByMonth', function(result) {
				console.log(result);
				for (var i in result) {
					var data = new Cost({
						date: result[i]._id.UsageStartDate,
						cost: result[i].Total,
						product: result[i]._id.ProductName
					});
					AWSMonthlyCost.add(data);
				}
				self.getAWSMonthlyCostNonFree();
				// self.set('dataReady', Date.now());
				console.log(AWSMonthlyCost);
			});
		})();
	},
	getAWSMonthlyCostNonFree: function() {
		AWSMonthlyCostNF.reset();
		var self = this;
		(function() {
			$.get(host + '/api/billing/groupByMonthNF', function(result) {
				for (var i in result) {
					var data = new Cost({
						date: result[i]._id.UsageStartDate,
						cost: result[i].Total,
						product: result[i]._id.ProductName
					});
					AWSMonthlyCostNF.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})();
	},
	getMonth: function(value) {
		var mnth = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return mnth[value - 1];
	}
});

var Cost = Backbone.Model.extend({
	defaults: {
		date: null,
		cost: null,
	}
});

var CostCollection = Backbone.Collection.extend({
	model: Cost,
	initialize: function() {
		this.on('add', function(model) {
		});
	}
});

var hourlyCostCollection = new CostCollection();
var AWSMonthlyCost = new CostCollection(); 
var AWSMonthlyCostNF = new CostCollection(); 