var BillingCollection = Backbone.Collection.extend({
	model: BillingModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {
			// console.log('something got added');
		});
	}
});


var BillingsModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		// this.addBilling();
		this.change('dataReady');


	},
	billing_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'application/json',
			url: 'http://localhost:3000/api/billing',
			success: function(data) {
				result = data;
			}
		});
	},



	getBilling: function() {
		var self = this;
		var count = 0;
		this.billing_result().done(function(result) {
			billingCollection.reset();

			for (var i in result) {
				var rName = result[i].name;
				var rID = result[i].id;
				var rCost = result[i].cost;
				var rSTime = result[i].startTime;
				var rCount = count++;

				var data = new BillingModel({
						name: rName,
						id: rID,
						cost: rCost,
						startTime:rSTime,
						count: rCount

					});
				billingCollection.add(data);
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
		id: null,
		cost: null,
		startTime: null,
		name: null,
		count: 0

	}
});

var AWSBillingCollection = Backbone.Collection.extend({
	model: BillingModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});

	}
});
// Create the collection
var billingCollection = new AWSBillingCollection();