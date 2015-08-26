var CostModel = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		this.change('dataReady');
	},

	getEC2Cost: function(product) {
		hourlyCostCollection.reset();
		var self = this;
		var params = {
			productName: product
		};
		(function(params) {
			$.get(host + '/api/billing/hourlyCostProduct', params, function(result) {
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
		var params = {
			productName: product
		};
		(function(params) {
			$.get(host + '/api/billing/rds/hourlyCostProduct', params, function(result) {
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
				for (var i in result) {
					var data = new Cost({
						date: result[i]._id.UsageStartDate,
						cost: result[i].Total,
						product: result[i]._id.ProductName
					});
					AWSMonthlyCost.add(data);
				}
				self.getAWSMonthlyCostNonFree();
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
	},
	//Organize for display in a stacked bar chart
	OrganizeData: function(collection, stax) {
		var hm = {}; //hashmap
		var fseries = []; //final series data
		var colors = ['#50B432', '#ED561B', '#DDDF00', '#24CBE5',
			'#64E572', '#FF9655', '#FFF263', '#6AF9C4'
		];
		//create productName variables
		var productNames = {};
		for (var i = 0; i < collection.length; ++i) {
			var product = collection.at(i).get('product');
			if (!(product in productNames)) {
				productNames[collection.at(i).get('product')] = [{
					name: collection.at(i).get('product'),
					data: [],
					stack: stax,
					colors: colors[i]
				}];
			}
		}
		//create a hashmap
		for (var i = 0; i < collection.length; i++) {
			var product = collection.at(i).get('product');
			var cost = collection.at(i).get('cost');

			productNames[collection.at(i).get('product')][0].data.push(cost)
			hm[product] = {
				name: product,
				data: productNames[collection.at(i).get('product')][0].data,
				stack: productNames[collection.at(i).get('product')][0].stack,
				colors: productNames[collection.at(i).get('product')][0].colors
			};
		}
		//create the series
		for (var i in hm) {
			if (stax == 'non-free-tier') {
				var fdata = {
					name: hm[i].name, //productName (ie; EC2)
					data: hm[i].data, //the date per month
					stack: hm[i].stack, // Free-tier or non-free-tier
					color: hm[i].colors,
					id: hm[i].name
				};
			} else {
				var fdata = {
					name: hm[i].name, //productName (ie; EC2)
					data: hm[i].data, //the date per month
					stack: hm[i].stack, // Free-tier or non-free-tier
					color: hm[i].colors,
					linkedTo: hm[i].name
				};
			}
			fseries.push(fdata);
		}
		return fseries;
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
		this.on('add', function(model) {});
	}
});

var hourlyCostCollection = new CostCollection();
var AWSMonthlyCost = new CostCollection();
var AWSMonthlyCostNF = new CostCollection();