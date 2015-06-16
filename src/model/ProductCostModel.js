var ProductCostModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.addProductCost();
		this.change('dataReady');
	},
	aws_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/billing/totalCostProduct',
			success: function(data) {
				result = data;
			}
		});
	},

	addProductCost: function() {
		var self = this;

		this.aws_result().done(function(result) {
			console.log(result);
			productCostCollection.reset();

			for (var r in result) {
				var data = new pCostModel({
					productName: result[r]._id,
					cost: result[r].Total
				});
				productCostCollection.add(data);
			}
			self.set('dataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	calcTotal: function() {
		var total = 0;
		for (var i = 0; i < productCostCollection.length; i++) {
			total += productCostCollection.at(i).get('cost');
		}
		return total;
	}
});

var pCostModel = Backbone.Model.extend({
	defaults: {
		instance: null,
		imageId: null
	}
});

var pCostCollection = Backbone.Collection.extend({
	model: InstanceModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var productCostCollection = new pCostCollection();