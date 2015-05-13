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
		// console.log("Init instances model");

		var data = {};
		var result;

		this.addEC2Instance();
		this.change('dataReady');
		this.change('cpuMetrics');
		this.change('networkInMetrics');
		this.change('networkOutMetrics');
	},

	aws_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'application/json',
			url: 'http://localhost:3000/api/instances',
			success: function(data) {
				// console.log('success');
				// console.log(data);
				result = data;
			}
		});
	},

	// Add the information from AWS to the collection here
	addEC2Instance: function() {
		var self = this;

		this.aws_result().done(function(result) {
			// console.log(result);
			instanceCollection.reset();
			cpuMetricCollection.reset();
			networkInMetricCollection.reset();
			networkOutMetricCollection.reset();
			for (var r in result.Reservations) {
				for (var i in result.Reservations[r].Instances) {
					var rInstance = result.Reservations[r].Instances[i];
					var rImage = rInstance.ImageId;
					var rState = rInstance.State.Name;
					var rKeyName = rInstance.KeyName;
					var rInstanceType = rInstance.InstanceType;
					var rLaunchTime = rInstance.LaunchTime;
					//LOGIC FOR PARSING AND COMPUTING RUNNING TIME
					var d = new Date();
					var rUnixLaunch = Date.parse(rLaunchTime);
					var rUnixNow = d.getTime();
					var rDuration = (rUnixNow - rUnixLaunch) / 1000;

					var rZone = rInstance.Placement.AvailabilityZone;


					// console.log(rInstance.InstanceId + " (" + rState + ") " + " (" + rImage + ") " +
					// 	" (" + rInstance.PublicDnsName + ") " + "(" + rKeyName +
					// 	") " + "(" + rInstanceType + ") " + "(" + rUnixLaunch + ") " + "(" + rDuration + ") " + "(" + rZone + ") ");


					self.getCPUMetrics(rInstance.InstanceId, rState);
					self.getInNetworkMetrics(rInstance.InstanceId, rState);
					self.getOutNetworkMetrics(rInstance.InstanceId, rState);

					var data = new InstanceModel({
						instance: rInstance.InstanceId,
						imageId: rImage,
						state: rState,
						keyName: rKeyName,
						instanceType: rInstanceType,
						launchTime: rLaunchTime,
						duration: rDuration,
						zone: rZone,
						email: rEmail
					});

					instanceCollection.add(data);

				}
			}

			self.set('dataReady', Date.now());
			console.log('Instances Data Ready');

		}).fail(function() {
			console.log('FAILED');
		});
	},
	//GET average CPU usage for 1 hour
	getCPUMetrics: function(val, rstate) {
		var self = this;
		var fData;

		if (rstate == "running") {


			var d = new Date();
			var rUnixNow = d.getTime();
			var rEndTime = parseInt(rUnixNow / 1000);
			var rStartTime = rEndTime - 3600

			var params = {
				endTime: 1431440584,
				startTime: (1431440584),
				value: 'i-312254c7',
				metric: 'CPUUtilization'
			};
			//params.value = instanceCollection.models[i].attributes.instance;
			params.value = val;
			params.endTime = parseInt(rEndTime - 3000);
			params.startTime = parseInt(rStartTime);

			$.get('http://localhost:3000/api/cpu', params, function(data) {
				if (data.Datapoints[0].Average) {
					// console.log(params.value, data.Datapoints[0].Average);
					// console.log(params.value, data);
					fData = new MetricModel({
						instance: params.value,
						cpu: data.Datapoints[0].Average
					});
					cpuMetricCollection.add(fData);
					self.set('cpuMetrics', Date.now());

				}

			});


		} else {
			// console.log("instance not running", val);
			fData = new MetricModel({
				instance: val,
				cpu: 0
			});
			cpuMetricCollection.add(fData);
			self.set('cpuMetrics', Date.now());

		}


	},

	getInNetworkMetrics: function(val, rstate) {
		var fData;
		var self = this;
		if (rstate == "running") {
			var d = new Date();
			var rUnixNow = d.getTime();
			var rEndTime = parseInt(rUnixNow / 1000);
			var rStartTime = rEndTime - 3600

			var params = {
				endTime: 1431440584,
				startTime: (1431440584),
				value: 'i-312254c7',
				metric: 'NetworkIn'
			};
			//params.value = instanceCollection.models[i].attributes.instance;
			params.value = val;
			params.endTime = parseInt(rEndTime - 3000);
			params.startTime = parseInt(rStartTime);

			$.get('http://localhost:3000/api/network/in', params, function(data) {
				if (data.Datapoints[0].Average) {
					// console.log(params.value, data.Datapoints[0].Average);
					// console.log(params.value, data);
					fData = new MetricModel({
						instance: params.value,
						networkIn: data.Datapoints[0].Average
					});
					networkInMetricCollection.add(fData);
					self.set('networkInMetrics', Date.now());


				}

			});
		} else {
			// console.log("instance not running", val);
			fData = new MetricModel({
				instance: val,
				networkIn: 0
			});
			networkInMetricCollection.add(fData);
			self.set('networkInMetrics', Date.now());

		}
	},
	getOutNetworkMetrics: function(val, rstate) {
		var fData;
		var self = this;
		if (rstate == "running") {
			var d = new Date();
			var rUnixNow = d.getTime();
			var rEndTime = parseInt(rUnixNow / 1000);
			var rStartTime = rEndTime - 3600

			var params = {
				endTime: 1431440584,
				startTime: (1431440584),
				value: 'i-312254c7',
				metric: 'NetworkOut'
			};
			//params.value = instanceCollection.models[i].attributes.instance;
			params.value = val;
			params.endTime = parseInt(rEndTime - 3000);
			params.startTime = parseInt(rStartTime);

			$.get('http://localhost:3000/api/network/out', params, function(data) {
				if (data.Datapoints[0].Average) {
					// console.log(params.value, data.Datapoints[0].Average);
					// console.log(params.value, data);
					fData = new MetricModel({
						instance: params.value,
						networkOut: data.Datapoints[0].Average
					});
					networkOutMetricCollection.add(fData);
					self.set('networkOutMetrics', Date.now());
				}

			});
		} else {
			// console.log("instance not running", val);
			fData = new MetricModel({
				instance: val,
				networkOut: 0
			});
			networkOutMetricCollection.add(fData);
			self.set('networkOutMetrics', Date.now());

		}
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
		email: "mikesmit.com@gmail.com"

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

