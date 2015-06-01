var AWS = require('aws-sdk'); //AWS SDK
var http = require('http');
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;

// Express import
var express = require('express');
var app = express(); //ExpressJS library

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
var getCPU = function(req, res) {
    console.log("req:" + req.query.value);
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
        // console.log(data);
        rData = data;
        // res.send(rData);\
        return rData;
    });

};


var getNetworkIn = function(req, res) {
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
        // console.log(data);
        nData = data;
        // res.send(nData);
        return nData;
    });

};

// GET
var getNetworkOut = function(req, res) {
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
        // console.log(data);
        oData = data;
        return oData;
    });


};


// EC2 Instances
var getEC2Instances = function(req, res) {
    // app.get('/api/instances', function(req, res) {
    //us-west-2 specificl at the moment.
    //parameterize the region?
    var ec2 = new AWS.EC2({
        region: "us-west-2"
    });

    // GET information on EC2 instances. Returns JSON.
    ec2.describeInstances({}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        for (var r in data.Reservations) {
            for (var i in data.Reservations[r].Instances) {
                for (var t in data.Reservations[r].Instances[i].Tags) {
                    // if (data.Reservations[r].Instances[i].Tags[t].Key == "Volume Id") {
                    // if (data.Reservations[r].Instances[i].Tags[t].Value == "") {
                    // console.log(data.Reservations[r].Instances[i].Tags[t]);
                    var rInstance = data.Reservations[r].Instances[i];
                    var instanceId = rInstance.InstanceId;
                    var volumeId = rInstance.BlockDeviceMappings[0].Ebs.VolumeId;
                    // console.log(instanceId);
                    // console.log(volumeId);

                    var params_vol = {
                        Resources: [ /* required */
                            instanceId,
                            /* more items */
                        ],
                        Tags: [ /* required */ {
                                Key: 'Volume Id',
                                Value: volumeId
                            },
                            /* more items */
                        ]
                    };
                    ec2.createTags(params_vol, function(err) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else console.log(data); // successful response
                    });
                    // }
                    // }
                }
            }
        }

        var finalData = data;
        return finalData;
        // res.send(finaldata);
    });
};
module.exports = {
    getCPU: getCPU,
    getNetworkIn: getNetworkIn,
    getNetworkOut: getNetworkOut,
    getEC2Instances: getEC2Instances
}