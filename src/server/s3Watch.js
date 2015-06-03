/*
	s3connect gets large csv.zip file and extracts it in /data/
*/
var fs=require("fs");
var compress = require('adm-zip');
var AWS = require('aws-sdk'); //AWS SDK
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';
var parser = require('./billingParse');
var app = require('express')();
var adm = require('adm-zip'); //compression library library
var okey;
var params = {
    //fix the bucket name to be flexible.
    Bucket: 'ario'

};
var s3 = new AWS.S3();
exports.s3Connect = function(req, res) {

    s3.listObjects(params, function(err, data) {
        //THIS NEEDS TO BE UPDATED BASED UPON CURRENT DATE AND OWNERID.
        okey = data.Contents[1].Key;
        console.log("okey: "+okey);

        var params_ = {
            Bucket: 'ario',
            Key: okey
        };

        console.log("starting download of test.zip");
        var file = fs.createWriteStream('test.zip');
        s3.getObject(params_).createReadStream().pipe(file);
        // res.send("File retrieved: " + okey);

        file.on('close', function() {
            console.log("Billing data retrieved from S3 Bucket and unzipped");
            var unzip = new adm('test.zip');
            try {
                unzip.extractAllTo("data", true);
            } catch (e) {
                console.log(e);
            }
            fs.readdir(process.cwd()+'/data/', function (err, files) {
                if (err) {
                    console.log(err);
                    return;
                }
                if(files[0]==='latestBills'){
                    fs.rename(process.cwd()+'/data/'+files[1], process.cwd()+'/data/latestBills.csv', function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                        console.log(files[0]+" renamed to latestBills.csv");
                    });
                }else{
                    fs.rename(process.cwd()+'/data/'+files[0], process.cwd()+'/data/latestBills.csv', function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                        console.log(files[0]+" renamed to latestBills.csv");
                    });
                }
            });
            parser.parseBillingCSV();
        });            
    });	
    s3.s3Watch();
};
that = this;
s3.s3Watch = function() {
    console.log("Watching s3 bucket on timer of 15 minutes");
    setTimeout(that.s3Connect.bind(that), 1000 * 60 * 15);
};