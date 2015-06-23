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
					var data = new EC2Model({
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
					var data = new EC2Model({
						date: result[i]._id,
						cost: result[i].Total
					});
					hourlyCostCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	}
});

var EC2Model = Backbone.Model.extend({
	defaults: {
		date: null,
		cost: null,
	}
});

var EC2CostCollection = Backbone.Collection.extend({
	model: EC2Model,
	initialize: function() {
		this.on('add', function(model) {
		});
	}
});

var hourlyCostCollection = new EC2CostCollection();
