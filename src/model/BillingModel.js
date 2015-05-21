var BillingCollection = Backbone.Collection.extend({
	model: BillingModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {
			// console.log('something got added');
		});
	}
});

var BillingModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.addBillingInstance();
		this.change('billingMetrics');


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
		var fData;
		this.billing_result().done(function(result) {
			// console.log(result);
			instanceCollection.reset();

			for (var i in billingMetricCollection) {
				var rID = billingMetricCollection.at(i).get('id');
				var rCost = billingMetricCollection.at(i).get('cost');
				var rSTime = billingMetricCollection.at(i).get('startTime');


				//params.value = instanceCollection.models[i].attributes.instance;

				$.get('http://localhost:3000//api/billing', function(data) {
					
					if (data.Datapoints[0].Average) {
						fData = new BillingModel({
							rID: data.Datapoints[0],
							rCost: data.Datapoints[1],
							rSTime: data.Datapoints[2]
						});
						
					billingMetricCollection.add(fData);
					}

					self.set('billingMetrics', Date.now());

				});



			}
		}).fail(function() {
			console.log('FAILED');
		});
	}
});

// A instance model template
var BillingModel = Backbone.Model.extend({
	defaults: {
		rID: null,
		rCost: null,
		rSTime: null

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