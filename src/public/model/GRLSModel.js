// The instances model where we manipulate the data from AWS
var GRLSModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('ec2InstancesDataReady');
		this.change('rdsInstancesDataReady');
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
				if(/^t2/.test(result[r].Type)){
					var data = new ec2InstanceModel({
						instance: result[r].Id,
						state: result[r].State,
						userName: result[r].Name,
						groupName: result[r].Group,
						instanceType: result[r].Type,
						launchTime: result[r].LaunchTime,
						lifetime: result[r].Lifetime,
						zone: result[r].Zone
					});
					ec2InstancesCollection.add(data);
				}
			}
			self.set('ec2InstancesDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
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
			self.set('rdsInstancesDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	}
});

var ec2InstanceModel = Backbone.Model.extend({
	defaults: {
		instance: null,
		state: null,
		userName: 'null',
		groupName: 'null',
		instanceType: null,
		launchTime: null,
		lifetime: null,
		zone: null
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

var ec2InstancesCollection = new EC2InstancesCollection();
var rdsInstancesCollection = new RDSInstancesCollection();