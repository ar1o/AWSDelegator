// This holds the entire collection of EC2 Instances and its information
var MetricsCollection = Backbone.Collection.extend({
	model: MetricModel,
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
var MetricsModel = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		this.change('dataReady');
	},

	getMetrics: function(instanceid) {
		metricsCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid
		};

		(function(params) {
			$.get(host+'/api/metrics', params, function(result) {
				// console.log("metrics",result);
				for (var i in result) {
					var data = new MetricModel({
						instance: result[i].InstanceId,
						networkIn: result[i].NetworkIn,
						networkOut: result[i].NetworkOut,
						cpuUtilization: result[i].CPUUtilization,
						time: result[i].Time
					});
					metricsCollection.add(data);
				}
				self.set('dataReady', Date.now());
			});
		})(params);
	}
});

// A metrics model template
var MetricModel = Backbone.Model.extend({
	defaults: {
		instance: null,
		networkIn: null,
		networkOut: null,
		cpuUtilization: null,
		time: null
	}
});