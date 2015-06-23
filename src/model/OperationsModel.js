var OperationsModel = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		this.change('dataReady');
	},
	getEC2Operations: function(product) {
		operationsCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			productName: 'Amazon Elastic Compute Cloud'
		};
		(function(params) {
			$.get(host+'/api/statistics/ec2/operations', params, function(result) {
				// console.log(result);
				for (var i in result) {
					var data = new operationsModel({
						operation: i,
						percentage: result[i]
					});
					operationsCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	},
	getRDSOperations: function(product) {
		operationsCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			productName: 'Amazon RDS Service'
		};
		(function(params) {
			$.get(host+'/api/statistics/rds/operations', params, function(result) {
				for (var i in result) {
					var data = new operationsModel({
						operation: i,
						percentage: result[i]
					});
					operationsCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	}
});

var operationsModel = Backbone.Model.extend({
	defaults: {
		operation: null,
		percentage: null
	}
});

var OperationsCollection = Backbone.Collection.extend({
	model: operationsModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var operationsCollection = new OperationsCollection();