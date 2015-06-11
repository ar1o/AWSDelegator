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
		this.change('dataReady');


	},

	getBilling: function(instanceid) {
		totalCostInstancesCollection.reset();
		var self = this;
		var count = 0;

		var params = {
			instance: instanceid
		};
		(function(params) {

			$.get('http://localhost:3000/api/billing/instanceCostAll', params, function(result) {
				console.log(result);
				for (var i in result) {
					var data = new BillingModel({
						resourceId: result[i].resourceId,
						cost: result[i].cost,
						volumeId: result[i].volumeId,
						date: result[i].date
					});

					totalCostInstancesCollection.add(data);
				}

				self.set('dataReady', Date.now());

			});

		})(params);
	}
});

// A billings model template
var BillingModel = Backbone.Model.extend({
	defaults: {
		resourceId: null,
		cost: null,
		volumeId: null,
		date: null

	}
});