var BillingsModel = Backbone.Model.extend({
	initialize: function() {
		this.change('dataReady');
		this.change('operationDataReady');
	},

	getBilling: function(instanceid, volumeId) {
		totalCostInstancesCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid,
			volume: volumeId
		};

		(function(params) {
			$.get(host + '/api/billing/instanceCostAll', params, function(result) {
				for (var i in result) {
					var data = new BillingModel({
						resourceId: params.instance,
						cost: result[i].Total,
						date: result[i]._id
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
		var volumeArray = volumeId.split(',');
		var self = this;
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
				self.getBilling(instanceid, volumeId);
			});
		})(params);
	},
	calculateOperationCost: function(selected, resourceId, product){
		operationCostCollection.reset();
		var self = this;
		var params = {
			operation: selected[0],
			instance: resourceId,
			productName: product
		};
		(function(params) {
			$.get(host + '/api/billing/ec2/operationCost', params, function(result) {
				for (var i in result) {
					var data = new operationCostModel({
						resourceId: resourceId,
						operation: selected[0],
						color: selected[1],
						cost: result[i].Cost,
						date: result[i].UsageStartDate
					});
					operationCostCollection.add(data);
				}
				self.set('operationDataReady', Date.now());
			});
		})(params);
	},
	getRDSBilling: function(instanceid) {
		totalCostInstancesCollection.reset();
		var self = this;
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

var operationCostModel =  Backbone.Model.extend({
	defaults: {
		resourceId: null,
		operation: null,
		color: null,
		cost: 0,
		date: null
	}
});

var OperationCostCollection = Backbone.Collection.extend({
	model: operationCostModel,
	initialize: function() {
		this.on('add', function(model) {});
	}
});

var TCost = new InstanceTotalCostCollection();
var totalCostInstancesCollection = new InstanceTotalCostCollection();
var operationCostCollection = new OperationCostCollection();