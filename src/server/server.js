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

var router = express.Router();

app.use(require('./CORS'));


port = process.env.PORT || 3000;


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

var s3 = (require('./s3Watch')); //S3 bucket connection
s3.s3Connect();


app.use('/api/instances', require('./instanceRoute')).instances;
// app.use('/api/network/', require('./networkRoute')).network;
app.use('/api/cpu', require('./cpuRoute')).cpu;
// app.use('api/billing', require('./billingRoute')).billing;



app.listen(port);
console.log('server started on port %s', port);