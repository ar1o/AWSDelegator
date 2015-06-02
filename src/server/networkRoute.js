
var params = {
    EndTime: 1431440584,
    /* required */
    MetricName: 'CPUUtilization',
    /* required */
    Namespace: 'AWS/EC2',
    /* required */
    Period: 3600,
    /* required */
    StartTime: 1431440584 - 3600,
    /* required */
    Statistics: ['Average'],
    Dimensions: [{
            Name: 'InstanceId',
            /* required */
            Value: 'i-192650ef' /* required */
        },
        /* more items */
    ],
    Unit: 'Percent'
};

exports.networkIn = function(req, res){
	var val = req.query.value;
	var rEndTime = parseInt(req.query.endTime);
	var rStartTime = parseInt(req.query.startTime);
	var rMetricName = req.query.metric;

	params.Dimensions[0].Value = val;
	params.EndTime = rEndTime;
	params.StartTime = rStartTime;
	params.MetricName = rMetricName;
	params.Unit = 'Bytes'
	var cloudwatch = new AWS.CloudWatch();
	cloudwatch.getMetricStatistics(params, function(err, data) {
		res.send(data);
	});
};

exports.networkOut = function(req, res){
    var val = req.query.value;
    var rEndTime = parseInt(req.query.endTime);
    var rStartTime = parseInt(req.query.startTime);
    var rMetricName = req.query.metric;
    params.Dimensions[0].Value = val;
    params.EndTime = rEndTime;
    params.StartTime = rStartTime;
    params.MetricName = rMetricName;
    params.Unit = 'Bytes'
    var cloudwatch = new AWS.CloudWatch();
    cloudwatch.getMetricStatistics(params, function(err, data) {
		res.send(data);
    });
};
