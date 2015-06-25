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
	},
	calcTotalCost: function(instanceid, volumeId) {
		TCost.reset();
		//First check for the number of attached volumes
		console.log("The volume id is",volumeId);
		var volumeArray = volumeId.split(',');
		console.log("Number of volumes attached is ",volumeArray);
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid,
			volume: volumeId
		};

		(function(params) {
			$.get(host + '/api/billing/calcTotalCost', params, function(result) {
				for (var i in result) {
					var data = new BillingModel({
						resourceId: params.instance,
						cost: result[i].Total,
						date: result[i]._id
					});
					TCost.add(data);
				}
				self.getBilling(instanceid);
			});
		})(params);
	},
	getRDSBilling: function(instanceid) {
		totalCostInstancesCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid
		};
		(function(params) {
			$.get(host + '/api/billing/rds/instanceCostAll', params, function(result) {
				for (var i in result) {
					var data = new RDSBillingModel({
						resourceId: result[i].ResourceId[0],
						cost: result[i].Total,
						date: result[i]._id
					});
					totalCostInstancesCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	}
});

var BillingModel = Backbone.Model.extend({
	defaults: {
		resourceId: null,
		cost: null,
		volumeId: null,
		date: null
	}
});


var RDSBillingModel = Backbone.Model.extend({
	defaults: {
		resourceId: null,
		cost: null,
		date: null
	}
});


var InstanceTotalCostCollection = Backbone.Collection.extend({
	model: BillingModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});

	}
});

var TCost = new InstanceTotalCostCollection();
var totalCostInstancesCollection = new InstanceTotalCostCollection();