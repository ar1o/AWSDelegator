var csv = require("fast-csv");
adm = require('adm-zip'); //compression library library
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

app.use(require('./CORS')); //CORS Module

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
        productName: String
    });
    var Billings = mongoose.model('Billings', billingSchema, 'billing');
});

if (!fs.existsSync(process.cwd()+'/data')){
        fs.mkdirSync(dir);
}

var s3 = (require('./s3Watch')); //S3 bucket connection
s3.s3Connect();

app.use('/api/instances', require('./instanceRoute'));
app.use('/api/cpu', require('./cpuRoute')).cpu; 

app.use('/api/network', require('./networkRoute').networkIn);
app.use('/api/network', require('./networkRoute').networkOut);

app.use('api/billing', require('./billingRoute').billingByHour);
app.use('api/billing', require('./billingRoute').billingMonthToDate);



function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', { error: err });
}
module.exports = errorHandler;

app.listen(port);
console.log('server started on port %s', port);