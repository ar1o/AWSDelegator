module.exports = function(req, res) {
	// console.log("Metric request", req.query.instance);
	var instanceId = req.query.instance;
	mongoose.model('Ec2Metrics').aggregate([{
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
	}]).exec(function(err, instanceMetrics) {
		res.send(instanceMetrics);
	});
}