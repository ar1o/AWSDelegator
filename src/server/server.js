currentCollection = "bills201505";
var http = require('http');
var fs = require('fs'); //file reader-writer library
AWS = require('aws-sdk'); //AWS SDK
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';
// Express import
var express = require('express'); //ExpressJS library
// Mongoose import
mongoose = require('mongoose');
// Mongo import
mongo = require('mongodb');

var app = express();
port = process.env.PORT || 3000;

//CORS Module
app.use(require('./CORS'));

// Start mongoose and mongo
mongoose.connect('mongodb://localhost:27017/awsdb', function(error) {

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
        Cost: String,
        ResourceId: String,
        UsageStartDate: String,
        "user:Volume Id": String,
    });
    var Billings = mongoose.model('Billings', billingSchema, currentCollection);
});

if (!fs.existsSync(process.cwd()+'/data')){
        fs.mkdirSync(process.cwd()+'/data');
}

var s3 = (require('./s3Watch')); //S3 bucket connection
s3.s3Connect();

app.get('/api/instances', require('./instanceRoute'));
app.get('/api/cpu', require('./cpuRoute')).cpu;

app.get('/api/network/in', require('./networkRoute').networkIn);
app.get('/api/network/out', require('./networkRoute').networkOut);

app.get('/api/billing/monthToDate', require('./billingRoute').monthToDate);
app.get('/api/billing/byHour', require('./billingRoute').byHour);
app.get('/api/billing/instanceCost', require('./billingRoute').instanceCost);
app.get('/api/billing/instanceCostHourly', require('./billingRoute').instanceCostHourlyByDate);

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