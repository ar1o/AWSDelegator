/*
	s3connect gets large csv.zip file and extracts it in /data/
*/
var fs = require("fs");
var adm = require('adm-zip');

var billingParser = require('../Parse/billingParse');
var instanceParser = require('../Parse/instanceParse');
var metricsParser = require('../Parse/metricsParse');

var okey;
var params = {
    //fix the bucket name to be flexible.
    Bucket: 'csvcontainer'
};
AWS.config.update({region: 'us-east-1'});
var s3 = new AWS.S3();
// AWS.config.update({region: 'us-east-1'});
exports.s3Connect = function(_callback) {
    s3.listObjects(params, function(err, data) {
        //THIS NEEDS TO BE UPDATED BASED UPON CURRENT DATE AND OWNERID.
        //console.log(data);
        okey = data.Contents[5].Key;
        console.log("okey: " + okey);

        var params_ = {
            Bucket: 'csvcontainer',
            Key: okey
        };
        fs.readdir(process.cwd() + '/data/', function(err, files) {
            if (err) throw err;
            var latestBillsindex = files.indexOf('latestBills.csv');
            if (latestBillsindex != -1) {
                fs.unlink(process.cwd() + '/data/' + files[latestBillsindex], function(unlink_err) {
                    if (unlink_err) throw unlink_err;
                });
            }
            console.log("starting download of datasheet.zip");
            var file = fs.createWriteStream('datasheet.zip');
            s3.getObject(params_).createReadStream().pipe(file);
            file.on('close', function() {
                console.log("Billing data retrieved from S3 Bucket and unzipped");
                var unzip = new adm('datasheet.zip');
                try {
                    unzip.extractAllTo("data", true);
                } catch (e) {
                    console.log(e);
                }
                fs.readdir(process.cwd() + '/data/', function(err, files) {
                    if (err) throw err;
                    currentCollection = 'bills-' + files[0].substring(files[0].length - 11, files[0].length - 4);
                    currentCollection = currentCollection.replace(/-/g, "");
                    console.log("Updated currentCollection to " + currentCollection);
                    fs.rename(process.cwd() + '/data/' + files[0], process.cwd() + '/data/latestBills.csv', function(err) {
                        if (err) console.log('ERROR: ' + err);
                        console.log(files[0] + " renamed to latestBills.csv");
                    });
                    console.log("Parse Alert: BillingCSV parsing initiated");
                    billingParser.parseBillingCSV(function() {
                        console.log("Parse Alert: BillingCSV parsing completed");
                        console.log("Parse Alert: Metrics parsing initiated");
                        metricsParser.parseMetrics(function() {
                            console.log("Parse Alert: Metrics parsing completed");
                            console.log("Parse Alert: Instance parsing initiated");
                            instanceParser.parseInstances(function() {
                                console.log("Parse Alert: Instance parsing completed");
                                if (typeof _callback=="function") _callback();                            
                                s3.s3Watch();
                            }); 
                        });                                                 
                    });                                                            
                });
            });
        });
    });
};
that = this;
s3.s3Watch = function() {
    console.log("Watching s3 bucket on timer of 15 minutes");
    setTimeout(that.s3Connect.bind(that), 1000 * 60 * 15);
};
