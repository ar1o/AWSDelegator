var csv = require("fast-csv");
var adm = require('adm-zip'); //compression library library
var http = require('http');
var Converter = require('csvtojson').core.Converter; //csv -> json library
var fs = require('fs'); //file reader-writer library
var AWS = require('aws-sdk'); //AWS SDK
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';
// Express import
var express = require('express'); //ExpressJS library
// Mongoose import
var mongoose = require('mongoose');
// Mongo import
var mongo = require('mongodb');

var app = express();
port = process.env.PORT || 3000;

// module.exports = function() {};

// Start mongoose and mongo
mongoose.connect('mongodb://localhost:27017/testdb2', function(error) {
    if (error) {
        console.log(error);
    }
});

var db = mongoose.connection;

db.on("open", function() {
    console.log("mongodb is connected!!");

    var billingSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        productName: String
    });

    var Billings = mongoose.model('Billings', billingSchema, 'billing');



});
app.use(require('./CORS')); //CORS Module

var s3 = (require('./s3')); //S3 bucket connection

//Logic required to keep scope though setInterval:
// s3.s3connect();
s3.s3connect();



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
        // console.log(data);
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
        // console.log(data);
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
        // console.log(data);
        oData = data;
        res.send(oData);
    });


});


// EC2 Instances
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
                        // else console.log(data); // successful response
                    });
                    // }
                    // }
                }
            }
        }

        var finaldata = data;
        res.send(finaldata);
    });
});

// // S3 Bucket for billing data
// app.get('/api/buckets', function(req, res) {
//     var params = {
//         Bucket: 'ario'

//     };
//     var okey;
//     var s3 = new AWS.S3();
//     s3.listObjects(params, function(err, data) {
//         // if (err) console.log(err, err.stack); // an error occurred
//         // else console.log(data); // successful response

//         okey = data.Contents[2].Key;
//         // console.log(okey);

//         var params_ = {
//             Bucket: 'ario',
//             Key: okey
//         };
//         var file = fs.createWriteStream('test.zip');
//         s3.getObject(params_).createReadStream().pipe(file);
//         res.send("File retrieved: " + okey);

//         file.on('close', function() {
//             console.log("Billing data retrieved from S3 Bucket and unzipped");
//             var unzip = new adm('test.zip');
//             try {
//                 unzip.extractAllTo("data", true);
//             } catch (e) {
//                 console.log(e);
//             }
//         });

//     });
// });




// Billing data in JSON - data must exist!
// app.get('/api/billing', function(req, res) {
//     //GRAB ACCOUNT NUBER AND APPEND 
//     //Take month/year into account
//     //fix 
//     var csvFile = "data/092841396837-aws-billing-detailed-line-items-with-resources-and-tags-2015-05.csv"
//         //transform to a new .csv file
//     var stream = fs.createWriteStream("out.csv", {
//         encoding: "utf8"
//     })
//     var formatStream = csv
//         .createWriteStream({
//             headers: true
//         })
//         .transform(function(obj) {
//             return {
//                 name: obj.ProductName,
//                 cost: obj.Cost,
//                 id: obj.ResourceId,
//                 startTime: obj.UsageStartDate
//             };
//         });
//     csv
//         .fromPath(csvFile, {
//             headers: true
//         })
//         .pipe(formatStream)
//         .pipe(stream);

//     //convert to .json
//     stream.on("finish", function() {
//         console.log("DONE!");
//         var csvConverter = new Converter({
//             constructResult: false,
//             toArrayString: true
//         });
//         // var readStream = fs.createReadStream("out.csv");
//         var readStream = fs.createReadStream("out.csv");
//         var writeStream = fs.createWriteStream("outputData.json", {
//             flags: 'w'
//         });

//         readStream.pipe(csvConverter).pipe(writeStream);

//         writeStream.on('close', function() {
//             console.log("end");
//             res.sendFile("/home/ksimon/git/AWSDelegator/outputData.json");

//         });
//         var stream = fs.createReadStream(csvFile);

//     });
// });



app.get('/api/billing/month-to-date', function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            cost: {
                $gte: 0
            }
        }
    }, {
        $group: {
            _id: "$productName",
            total: {
                $sum: "$cost"
            }
        }
    }]).exec(function(e, d) {
        console.log(d)
        res.send(d);
    });


});


app.get('/api/billing/per-hour', function(req, res) {
    // var product = req.query.productName;
    // var time = req.query.startTime;
    mongoose.model('Billings').aggregate([{
        $match: {
            cost: {
                $gte: 0
            },
            // productName: {
            //     $eq: "Amazon Elastic Compute Cloud"
            // },
            startTime: {
                $eq: "2015-05-19 19:00:00"
            }
        }
    }, {
        $group: {
            _id: "$productName",
            total: {
                $sum: "$cost"
            }
        }
    }]).exec(function(e, d) {
        console.log(d);
        res.send(d);
    });


});

app.listen(port);
console.log('server started on port %s', port);