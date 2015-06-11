// This holds the entire collection of EC2 Instances and its information
var MetricsCollection = Backbone.Collection.extend({
	model: MetricsModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {
			// console.log('something got added');
		});
	}
});
// Create the collection
var metricsCollection = new MetricsCollection();

// The instances model where we manipulate the data from AWS
var MetricsModel= Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		// this.getEC2Metrics();
		this.change('dataReady');
	},
	aws_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: 'http://localhost:3000/api/ec2/metrics',
			success: function(data) {
				result = data;
			}
		});
	},

	// Add the information from AWS to the collection here
	getEC2Metrics: function() {
		var self = this;
		this.aws_result().done(function(result) {			
			metricsCollection.reset();
			for (var r in result) {			
				var data = new MetricsModel({
					instance: result[r].InstanceId,
					networkIn: result[r].NetworkIn,
					networkOut: result[r].NetworkOut,
					cpuUtilization: result[r].CPUUtilization,
					time: result[r].Time						
				});											
				metricsCollection.add(data);								
			}
			self.set('dataReady', Date.now());
			// console.log('Instances Data Ready');

		}).fail(function() {
			console.log('FAILED');
		});
	}

});

// A metrics model template
var MetricsModel = Backbone.Model.extend({
	defaults: {
		instance: null,
		networkIn: null,
		networkOut: null,
		cpuUtilization: null,
		time: null
	}
});