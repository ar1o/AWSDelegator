//Express middlewares which process the incoming requests before handling them down to the routes

// AWS Stuff
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';

// Express Stuff
var express = require('express'),
    app = express();
port = process.env.PORT || 3000;

// CORS 
app.use(require('./CORS'));

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

// GET
app.get('/api/cpu', function(req, res) {
    var val = req.query.value;
    var rEndTime = parseInt(req.query.endTime);
    var rStartTime = parseInt(req.query.startTime);
    var rMetricName = req.query.metric;

    params.Dimensions[0].Value = val;
    params.EndTime = rEndTime;
    params.StartTime = rStartTime;
    params.MetricName = rMetricName;
    params.Unit = 'Percent';

    var cloudwatch = new AWS.CloudWatch();
    cloudwatch.getMetricStatistics(params, function(err, data) {
        console.log(data);
        rData = data;
        res.send(rData);
    });

});

// GET
app.get('/api/network/in', function(req, res) {
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
        console.log(data);
        nData = data;
        res.send(nData);
    });

});

// GET
app.get('/api/network/out', function(req, res) {
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
        console.log(data);
        oData = data;
        res.send(oData);
    });


});


// route handler for GET /
app.get('/api/instances', function(req, res) {

    var ec2 = new AWS.EC2({
        region: "us-west-2"
    });
    // GET information on EC2 instances. Returns JSON.
    ec2.describeInstances({}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        //console.log(data);
        var finaldata = data;
        res.send(finaldata);

    });

});


app.listen(port);
console.log('server started on port %s', port);