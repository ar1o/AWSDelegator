exports.metrics = function(req, res) {
	var instanceId = req.query.instance;
	mongoose.model('rdsMetrics').aggregate([{
		$match: {
			DBInstanceIdentifier:{
				$eq: instanceId
			}
		}
	}]).exec(function(e, d) {
		res.send(d);
	});
}

exports.instances = function(req, res) {
	mongoose.model('rdsInstances').aggregate([{
		$project: {
			_id: 0,
			DBInstanceIdentifier: 1,
			DBInstanceClass: 1,
			Engine: 1,
			DBInstanceStatus: 1,
			MasterUsername: 1,
			DBName: 1,
			Endpoint: 1,
			AllocatedStorage: 1,
			InstanceCreateTime: 1,
			AvailabilityZone: 1,
			MultiAZ: 1,
			StorageType: 1                   
        }
    }]).exec(function(e, d) {
        if(e) throw e;
        res.send(d);
    });
}