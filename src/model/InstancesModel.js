var InstancesModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('dataReady');
	},
	aws_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/instances',
			success: function(data) {
				result = data;
			}
		});
	},

	getEC2Instances: function() {
		var self = this;
		console.log('getEC2Instances');
		this.aws_result().done(function(result) {
			instanceCollection.reset();
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
		}).fail(function() {
			console.log('FAILED');
		});
	}
});

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

var EC2InstancesCollection = Backbone.Collection.extend({
	model: InstanceModel,
	initialize: function() {
		this.on('add', function(model) {});
	}
});

var instanceCollection = new EC2InstancesCollection();