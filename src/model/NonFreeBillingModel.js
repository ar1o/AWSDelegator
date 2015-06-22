var NonFreeBillingsModel = Backbone.Model.extend({
	initialize: function() {
		this.change('dataReady');
	},

	getNonFreeBilling: function(instanceid) {
		TotalNonFreeCostCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid
		};

		(function(params) {
			$.get(host + '/api/NonFreeBilling/instanceCostAll', params, function(result) {
				for (var i in result) {
					var data = new NonFreeBillingModel({
						resourceId: result[i].resourceId,
						cost: result[i].cost,
						volumeId: result[i].volumeId,
						date: result[i].date
					});
					TotalNonFreeCostCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	}
});

var NonFreeBillingModel = Backbone.Model.extend({
	defaults: {
		resourceId: null,
		cost: null,
		volumeId: null,
		date: null
	}
});

var CostCollection = Backbone.Collection.extend({
	model: NonFreeBillingModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});

	}
});

var TotalNonFreeCostCollection = new CostCollection();
