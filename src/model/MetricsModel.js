var MetricsCollection = Backbone.Collection.extend({
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {
			// console.log('something got added');
		});
	}
});

// The instances model where we manipulate the data from AWS
var MetricsModel = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		this.change('dataReady');
	},

	getEC2Metrics: function(instanceid) {
		metricsCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid
		};

		(function(params) {
			$.get(host + '/api/ec2/metrics', params, function(result) {
				for (var i in result) {
					var data = new ec2MetricModel({
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
	},

	getRDSMetrics: function(instanceid) {
		metricsCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid
		};

		(function(params) {
			$.get(host + '/api/ec2/metrics', params, function(result) {
				for (var i in result) {
					var data = new ec2MetricModel({
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
	},

	getRDSMetrics: function(instanceid) {
		metricsCollection.reset();
		var self = this;
		var count = 0;
		var params = {
			instance: instanceid
		};

		(function(params) {
			$.get(host + '/api/rds/metrics', params, function(result) {
				for (var i in result) {
					var data = new rdsMetricModel({
						instance: result[i].DBInstanceIdentifier,
						cpuUtilization: result[i].CPUUtilization,
						// dbConnections: result[i].DatabaseConnections,
						diskQueueDepth: result[i].DiskQueueDepth,
						readIOPS: result[i].ReadIOPS,
						writeIOPS: result[i].WriteIOPS,
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
var ec2MetricModel = Backbone.Model.extend({
	defaults: {
		instance: null,
		networkIn: null,
		networkOut: null,
		cpuUtilization: null,
		time: null
	}
});

var rdsMetricModel = Backbone.Model.extend({
	defaults: {
		instance: String,
		cpuUtilization: Number,
		// dbConnections: Number,
		diskQueueDepth: Number,
		readIOPS: Number,
		writeIOPS: Number,
		time: String
	}
});

// Create the collection
var metricsCollection = new MetricsCollection();