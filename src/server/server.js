var http = require('http');
var fs = require('fs');
AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;
// AWS.config.update({region: 'us-west-2'});

// Express import
var express = require('express');
var app = express();
port = process.env.PORT || 3000;

databaseUrl = 'mongodb://localhost:27017/awsdb';
// Mongoose import
mongoose = require('mongoose');

// Mongo import
mongo = require('mongodb');


//CORS Module
app.use(require('./CORS'));

//S3 bucket connection
currentCollection = "";
var s3 = require('./s3Watch');

// Start mongoose and mongo
mongoose.connect(databaseUrl, function(error) {
    if (error) {
        console.log(error);
    }
});
var db = mongoose.connection;
db.on("open", function() {
    console.log("mongodb is connected!!");
    var billingSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        ProductName: String,
        Cost: Number,
        ResourceId: String,
        UsageStartDate: String,
        "user:Volume Id": String,
        Rate: Number,
        UsageType: String,
        ItemDescription: String,
        UsageQuantity: Number,
        RateId: Number,
        NonFreeRate : Number

    });
    var latestSchema = new mongoose.Schema({
        _id: mongoose.Schema.ObjectId,
        time: String
    });
    var instanceSchema = new mongoose.Schema({        
        Id: String,
        State: String,
        ImageId: String,
        KeyName: String,
        Type: String,
        LaunchTime: String,
        Zone: String,
        Lifetime: String,
        LastActiveTime: String,
        Email: String,
        VolumeId: String
    });
    var ec2metricsSchema = new mongoose.Schema({
        InstanceId: String,
        NetworkIn: Number,
        NetworkOut: Number,
        CPUUtilization: Number,
        Time: String
    });
    //TODO:
    // var pricingSchema = new mongoose.Schema({})

    s3.s3Connect(function() {
        var latestTime = mongoose.model('currentCollection', latestSchema, 'latest');
        mongoose.model('currentCollection').find([{}]).exec(function(e, d) {
            currentCollection = "bills" + d[0].time.substring(0, 7).replace(/-/, "");
        var Billings = mongoose.model('Billings', billingSchema, currentCollection);

        });
    });
    var Instances = mongoose.model('Instances', instanceSchema, 'instances');    
    var Ec2Metrics = mongoose.model('Ec2Metrics', ec2metricsSchema, 'ec2metrics');    
});

if (!fs.existsSync(process.cwd() + '/data')) {
    fs.mkdirSync(process.cwd() + '/data');
}

app.get('/api/instances', require('./Route/instanceRoute'));

app.get('/api/metrics', require('./Route/metricsRoute'));
app.get('/api/cpu', require('./Route/cpuRoute')).cpu;
app.get('/api/network/in', require('./Route/networkRoute').networkIn);
app.get('/api/network/out', require('./Route/networkRoute').networkOut);

app.get('/api/billing/monthToDate', require('./Route/billingRoute').monthToDate);
app.get('/api/billing/byHour', require('./Route/billingRoute').byHour);
app.get('/api/billing/instanceCost', require('./Route/billingRoute').instanceCost);
app.get('/api/billing/instanceCostHourly', require('./Route/billingRoute').instanceCostHourlyByDate);
app.get('/api/billing/instanceCostAll', require('./Route/billingRoute').instanceCostAll);

app.get('/api/billing/freeTier', require('./Route/freeTierRoute').freeTier);
app.get('/api/billing/calcFreeTierCost', require('./Route/billingRoute').calcFreeTierCost);

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {
        error: err
    });
}
module.exports = errorHandler;

app.listen(port);
console.log('server started on port %s', port);
