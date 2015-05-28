var csv = require("fast-csv");
var adm = require('adm-zip'); //compression library library
var http = require('http');
var fs = require('fs'); //file reader-writer library
var AWS = require('aws-sdk'); //AWS SDK
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';

var express = require('express'); //ExpressJS library


// Mongoose import
var mongoose = require('mongoose');
// Mongo import
var mongo = require('mongodb');


var app = express();
port = process.env.PORT || 3000;

app.use(require('./CORS')); //CORS Module



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
        productName: String,
        cost: String,
        ResourceId: String,
        startTime: String,
        volumeId: String

    });

    var Billings = mongoose.model('Billings', billingSchema, 'billing');



});



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

// S3 Bucket for billing data
app.get('/api/buckets', function(req, res) {
    var params = {
        Bucket: 'ario'

    };
    var okey;
    var s3 = new AWS.S3();
    s3.listObjects(params, function(err, data) {
        // if (err) console.log(err, err.stack); // an error occurred
        // else console.log(data); // successful response

        okey = data.Contents[2].Key;
        // console.log(okey);

        var params_ = {
            Bucket: 'ario',
            Key: okey
        };
        var file = fs.createWriteStream('test.zip');
        s3.getObject(params_).createReadStream().pipe(file);
        res.send("File retrieved: " + okey);

        file.on('close', function() {
            console.log("Billing data retrieved from S3 Bucket and unzipped");
            var unzip = new adm('test.zip');
            try {
                unzip.extractAllTo("data", true);
            } catch (e) {
                console.log(e);
            }
        });

    });
});

// Billing data in JSON - data must exist!
app.get('/api/billing', function(req, res) {
    var csvFile = "data/092841396837-aws-billing-detailed-line-items-with-resources-and-tags-2015-05.csv"
        //transform to a new .csv file
    var stream = fs.createWriteStream("out.csv", {
        encoding: "utf8"
    })
    var formatStream = csv
        .createWriteStream({
            headers: true
        })
        .transform(function(obj) {

            // var vol = 'user:email';
            // console.log(obj.vol);
            return {
                productName: obj.ProductName,
                cost: obj.Cost,
                ResourceId: obj.ResourceId,
                startTime: obj.UsageStartDate,
                volumeId: obj['user:Volume Id']
            };
        });
    csv
        .fromPath(csvFile, {
            headers: true
        })
        .pipe(formatStream)
        .pipe(stream);

    stream.on("finish", function() {
        res.send("Done transforming " + csvFile + " to out.csv");
    });

});



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
            productName: {
                $eq: "Amazon Elastic Compute Cloud"
            },
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

app.get('/api/billing/test', function(req, res) {
    //select objects from collection A

    // var query = { ResourceId: new RegExp('^i') };
    var instances = {};
    var volumes = {};
    mongoose.model('Billings').aggregate(
            {$match: {cost: {$gte: 0} , ResourceId: {$regex: '^(i-)'} }}, {$group: {_id: "$ResourceId", volumeId: {$addToSet: "$volumeId"}, total: {$sum: "$cost"}}}
        ).exec(function(e, d) {

                console.log(d);
                for (var r in d) {
                    if(d[r].volumeId[0] == '') { d[r].volumeId[0] = "null" }
                    console.log(d[r]._id + "\t" + d[r].volumeId[0] + "\t" + d[r].total);

                    instances[d[r].volumeId[0]] = {resourceId: d[r]._id, cost: d[r].total};
                }



                mongoose.model('Billings').aggregate( 
                    {$match: {cost: {$gte: 0} , volumeId: {$regex: '^(vol-)'} }}, {$group: {_id: "$volumeId", resourceId: {$addToSet: "$ResourceId"}, total: {$sum: "$cost"}}}

                ).exec(function(e, d) {
                    console.log(d);


                    // for (var r in d) {
                    //     console.log(d[r].ResourceId + "\t" + d[r].volumeId + "\t" + d[r].cost);
                    //     if(d[r].ResourceId in instances )
                    //         instances[d[r].ResourceId].cost += d[r].cost; 
                    // }



                });


                res.send(d);
    });

    //loop over these objects, create an array of your foreign keys and a hashmap of your objects stored by ID
    //(so that later you can do yourHashmap[some_id] to get your object from collection A)
    // var instances = {};
    // instances.ResourceId = d[r].ResourceId;
    // instances.cost = d[r].cost;
    // instances.volumeId = d[r].volumeId;


    //use your array of foreign keys to select collection B with mongo's $in


    //loop over collection B and use the foreign key on collection B to access your objects from
    // collection A using the hashmap your built


    //now you have the matching collection A and collection B objects and you can do whatever
    // you want with them. 

});

app.listen(port);
console.log('server started on port %s', port);



//queries!!
// db.billing.aggregate([{$project: {ResourceId:1, volumeId:1,cost:1, match: {$cond: [{$eq: ['$volumeId', ""]},'$ResourceId','$volumeId']}}},{$group:{_id:'$match',cost:{$sum: '$cost'},resId:{$addToSet: {$cond:[{$eq:['$match','$ResourceId']},null,'$ResourceId']}}}},{$unwind:'$resId'},{$project:{ResourceId: '$resId',cost:1,_id:0}}])
//db.billing.aggregate({$match: {cost: {$gte: 0}}},{$group: {_id: "$name", total: {$sum: "$cost"}}})
//db.billing.aggregate({$match: {cost: {$gte: 0}, productName: {$eq: "Amazon Elastic Compute Cloud"}, startTime: {$eq: "2015-05-19 19:00:00"} }}, {$group: {_id: "$productName", total: {$sum: "$cost"}}})
//db.billing.aggregate([{$project: {ResourceId:1, volumeId:1,cost:1, match: {$cond: [{$eq: ['$volumeId', ""]},'$ResourceId','$volumeId']}}},{$group:{_id:'$match',cost:{$sum: '$cost'},resId:{$addToSet: {$cond:[{$eq:['$match','$ResourceId']},null,'$ResourceId']}}}},{$unwind:'$resId'},{$match:{resId:{$ne:null}}},{$project:{ResourceId: '$resId',cost:1,_id:0}}])
// db.billing.aggregate([{$project:{total:{$cond: [ { $eq: [ "$ResourceId", "$Volume ID" ] }, 30, 20 ]}} }])