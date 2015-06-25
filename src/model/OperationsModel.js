var OperationsModel = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		this.change('dataReady');
	},

	getOperations: function(product) {
		operationsCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			productName: product
		};
		(function(params) {
			$.get(host + '/api/statistics/operations', params, function(result) {
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