billingSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        ProductName: String,
        Cost: Number,
        ResourceId: String,
        UsageStartDate: String,
        "user:Volume Id": String,
        Rate: Number,
        UsageType: String,
        ItemDescription: String,
        UsageQuantity: Number,
        RateId: Number,
        NonFreeRate : Number

    });
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
			$.get(host + '/api/billing/instanceCostAll', params, function(result) {
				console.log("billing ",result);
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