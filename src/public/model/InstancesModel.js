// The instances model where we manipulate the data from AWS
var InstancesModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('instancesDataReady');
		this.change('operationsDataReady');
	},
	ec2_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/ec2/instances',
			success: function(data) {
				result = data;
			}
		});
	},
	rds_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/rds/instances',
			success: function(data) {
				result = data;
			}
		});
	},

	getEC2Instances: function() {
		var self = this;
		ec2InstancesCollection.reset();
		this.ec2_result().done(function(result) {
			for (var r in result) {
				var data = new ec2InstanceModel({
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
				ec2InstancesCollection.add(data);
			}
			self.set('instancesDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getEC2Operations: function(instanceid){
		var self = this;
		operationsCollection.reset();
		var params = {
			instance: instanceid
		};

		(function(params) {
			$.get(host+'/api/ec2/operations', params, function(result) {
				for (var i in result) {
					var data = new operationsModel({
						operation: i,
						percentage: result[i]
					});
					operationsCollection.add(data);
				}
				self.set('operationsDataReady', Date.now());
			});
		})(params);
	},

	getRDSInstances: function() {
		var self = this;
		rdsInstancesCollection.reset();
		this.rds_result().done(function(result) {
			for (var r in result) {
				var data = new rdsInstanceModel({
					dbIdentifier: result[r].DBInstanceIdentifier,
					dbClass: result[r].DBInstanceClass,
					dbEngine: result[r].Engine,
					dbStatus: result[r].DBInstanceStatus,
					masterUsername: result[r].MasterUsername,
					dbName: result[r].DBName,
					endpoint: result[r].Endpoint,
					allocatedStorage: result[r].AllocatedStorage,
					launchTime: result[r].InstanceCreateTime,
					zone: result[r].AvailabilityZone,
					multiAz: result[r].MultiAZ,
					type: result[r].StorageType
				});
				rdsInstancesCollection.add(data);
			}
			self.set('instancesDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getRDSOperations: function(instanceid){
		var self = this;
		operationsCollection.reset();
		var params = {
			instance: 'arn:aws:rds:us-east-1:092841396837:db:'+instanceid
		};

		(function(params) {
			$.get(host+'/api/rds/operations', params, function(result) {
				for (var i in result) {
					var data = new operationsModel({
						operation: i,
						percentage: result[i]
					});
					operationsCollection.add(data);
				}
				self.set('operationsDataReady', Date.now());
			});
		})(params);
	},

	setEC2SelectedInstance: function(_instance, formUsageMonitorView) {
		selectedInstanceCollection.reset();
		var instanceId;
		if(formUsageMonitorView == true){
			instanceId = _instance;
		}else{
			instanceId = ec2InstancesCollection.at(_instance).get('instance');
		}
		var data = new selectedInstanceModel({
			instance: instanceId 
		});
		selectedInstanceCollection.add(data);
	},

	setRDSSelectedInstance: function(_instance, formUsageMonitorView) {
		selectedInstanceCollection.reset();
		var instanceId;
		if(formUsageMonitorView){
			instanceId = _instance;
		}else{
			instanceId = rdsInstancesCollection.at(_instance).get('dbIdentifier');
		}
		var data = new selectedInstanceModel({
			instance: instanceId 
		});
		selectedInstanceCollection.add(data);
	}
});

var ec2InstanceModel = Backbone.Model.extend({
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
	model: ec2InstanceModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var rdsInstanceModel = Backbone.Model.extend({
	defaults: {
		dbIdentifier: null,
		dbClass: null,
		dbEngine: null,
		dbStatus: null,
		masterUsername: null,
		dbName: null,
		endpoint: null,
		allocatedStorage: null,
		launchTime: null,
		zone: null,
		multiAz: null,
		type: null
	}
});

var RDSInstancesCollection = Backbone.Collection.extend({
	model: rdsInstanceModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var selectedInstanceModel = Backbone.Model.extend({
	defaults: {
		instance: null
	}
});

var SelectedInstanceCollection = Backbone.Collection.extend({
	model: selectedInstanceModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

var ec2InstancesCollection = new EC2InstancesCollection();
var rdsInstancesCollection = new RDSInstancesCollection();
var selectedInstanceCollection = new SelectedInstanceCollection();