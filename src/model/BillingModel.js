var InstanceTotalCostCollection = Backbone.Collection.extend({
	model: BillingModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});

	}
});

// Create the collection
var totalCostInstancesCollection = new InstanceTotalCostCollection();

var BillingsModel = Backbone.Model.extend({
	initialize: function() {
		console.log("HELLO THIS IS BILLINGMODEL");
		var data = {};
		// var result;
		this.getBilling();
		this.change('dataReady');


	},
	billing_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'text/plain',
			url: 'http://localhost:3000/api/billing/instanceCost',
			success: function(data) {
				// result = data;
			}
		});
	},



	getBilling: function() {
		var self = this;
		var count = 0;
		this.billing_result().done(function(result) {
			for (var i in result) {
				var data = new BillingModel({
					resourceId: result[i].resourceId,
					cost: result[i].cost,
					volumeId: result[i].volumeId
				});

				totalCostInstancesCollection.add(data);
			}
			self.set('dataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	}
});

// A billings model template
var BillingModel = Backbone.Model.extend({
	defaults: {
		resourceId: null,
		cost: null,
		volumeId: null

	}
});