module.exports = function(req,res){
	var instanceId = 'i-580a61a2';
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
		console.log(instanceMetrics);
		res.send(instanceMetrics);
	});
}