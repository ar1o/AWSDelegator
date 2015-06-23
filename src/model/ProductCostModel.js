var ProductCostModel = Backbone.Model.extend({
	initialize: function() {
		console.log("initizlied ProductCOstModel")
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
			productCostCollection.reset();

			for (var r in result.data) {
				var data = new pCostModel({
					productName: result.data[r]._id,
					cost: result.data[r].Total,
					month: result.month,
					year: result.year
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
	},
	getMonth: function(value) {
		var mnth = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return mnth[value - 1];
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