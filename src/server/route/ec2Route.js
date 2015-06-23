exports.metrics = function(req, res) {
    console.log(req.query);
	var instanceId = req.query.instance;
	mongoose.model('ec2Metrics').aggregate([{
		$match: {
			InstanceId: {
				$eq: instanceId
			}
		}
	}, {
		$project: {
			_id: 0,
			InstanceId: 1,
			NetworkIn: 1,
			NetworkOut: 1,
			CPUUtilization: 1,
			Time: 1
		}
	}]).exec(function(e, d) {
		res.send(d);
	});
}

exports.instances = function(req, res) {
    mongoose.model('ec2Instances').aggregate([{
        $project: {
            _id:0,
            Id: 1,
            State: 1,
            ImageId: 1,
            KeyName: 1,
            Type: 1,
            LaunchTime: 1,
            Zone: 1,
            Lifetime: 1,
            LastActiveTime: 1,
            Email: 1,
            VolumeId: 1                    
        }
    }]).exec(function(e, d) {
        if(e) throw e;
        res.send(d);
    });
}

