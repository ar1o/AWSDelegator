exports.metrics = function(req, res) {
	mongoose.model('Ec2Metrics').aggregate([{
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
};