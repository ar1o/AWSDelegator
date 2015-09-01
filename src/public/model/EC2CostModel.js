var EC2CostModel = Backbone.Model.extend({
	initialize: function() {
		// console.log("Initialized the EC2CostModel")
		var self = this;
		this.change('dataReady');
	},
	getCost: function(product) {
		EC2HourlyCostCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			productName: product
		};
		(function(params) {
			$.get(host+'/api/billing/hourlyCostProduct', params, function(result) {
				// console.log("Ec2Cost",result);
				for (var i in result) {
					var data = new EC2Model({
						date: result[i]._id,
						cost: result[i].Total
					});
					EC2HourlyCostCollection.add(data);
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

var EC2HourlyCostCollection = new EC2CostCollection();
