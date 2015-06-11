// This holds the entire collection of EC2 Instances and its information
var MetricsCollection = Backbone.Collection.extend({
	model: InstanceModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {
			// console.log('something got added');
		});
	}
});
// Create the collection
var cpuMetricCollection = new MetricsCollection();
var networkInMetricCollection = new MetricsCollection();
var networkOutMetricCollection = new MetricsCollection();

// The instances model where we manipulate the data from AWS
var InstancesModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;

		this.addEC2Instance();
		this.change('dataReady');
	},
	aws_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: 'http://localhost:3000/api/instances',
			success: function(data) {
				result = data;
			}
		});
	},

	// Add the information from AWS to the collection here
	addEC2Instance: function() {
		var self = this;

		this.aws_result().done(function(result) {
			console.log(result);
			instanceCollection.reset();
			cpuMetricCollection.reset();
			networkInMetricCollection.reset();
			networkOutMetricCollection.reset();
			for (var r in result) {			
				var data = new InstanceModel({
					instance: result[r].Id,
					imageId: result[r].ImageId,
					state: result[r].State,
					keyName: result[r].KeyName,
					instanceType: result[r].Type,
					launchTime: result[r].LaunchTime,
					duration: result[r].Lifetime,
					zone: result[r].Zone,
					email: result[r].Email,
					volumeid: result[r].VolumeId,
					lastActiveTime: result[r].LastActiveTime						
				});											
				instanceCollection.add(data);								
			}
			self.set('dataReady', Date.now());
			// console.log('Instances Data Ready');

		}).fail(function() {
			console.log('FAILED');
		});
	}

});

// A instance model template
var InstanceModel = Backbone.Model.extend({
	defaults: {
		instance: null,
		imageId: null,
		state: null,
		dns: null,
		keyName: null,
		instanceType: null,
		launchTime: null,
		runningTime: null,
		zone: null,
		email: "mikesmit.com@gmail.com",
		volumeid: null

	}
});
// A metrics model template
var MetricModel = Backbone.Model.extend({
	defaults: {
		instance: null
	}
});

var EC2InstancesCollection = Backbone.Collection.extend({
	model: InstanceModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});

	}
});

// Create the collection
var instanceCollection = new EC2InstancesCollection();