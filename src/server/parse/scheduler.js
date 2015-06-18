var fs = require("fs");
var adm = require('adm-zip');
var billingParser = require('./billingParse');
var ec2Parser = require('./ec2Parse');
var rdsParser = require('./rdsParse');
var okey;
AWS.config.region = s3Region;
var s3 = new AWS.S3();
var self = this;
var _params = {
    Bucket: s3Bucket
};

exports.s3Connect = function(_callback) {
    s3.listObjects(_params, function(err, data) {
        if (err) throw err;
        okey = data.Contents[5].Key;
        var params = {
            Bucket: s3Bucket,
            Key: okey
        };
        fs.readdir(process.cwd() + '/data/', function(err, files) {
            if (err) throw err;
            var latestBillsindex = files.indexOf('latestBills.csv');
            if (latestBillsindex != -1) {
                try {
                    fs.unlink(process.cwd() + '/data/' + files[latestBillsindex], function(unlink_err) {
                        if (unlink_err) throw unlink_err;
                    });
                } catch (err) {
                    throw err;
                }
            }
            console.log("starting download of datasheet.zip");
            var datasheet = fs.createWriteStream('datasheet.zip');
            s3.getObject(params).createReadStream().pipe(datasheet);
            datasheet.on('close', function() {
                console.log("Billing data retrieved from S3 Bucket and unzipped");
                var unzip = new adm('datasheet.zip');
                try {
                    unzip.extractAllTo("data", true);
                } catch (e) {
                    console.log(e);
                }
                fs.readdir(process.cwd() + '/data/', function(err, files) {
                    if (err) throw err;
                    currentBillingCollection = 'bills-' + files[0].substring(files[0].length - 11, files[0].length - 4);
                    currentBillingCollection = currentBillingCollection.replace(/-/g, "");
                    console.log("Updated currentBillingCollection to " + currentBillingCollection);
                    fs.rename(process.cwd() + '/data/' + files[0], process.cwd() + '/data/latestBills.csv', function(err) {
                        if (err) console.log('ERROR: ' + err);
                        console.log(files[0] + " renamed to latestBills.csv");
                    });
                    billingParser.parseBillingCSV(function() {
                        console.log("Parse Alert(Billing): CSV parsing completed");
                        if (typeof _callback=="function") _callback();
                    });
                    AWS.config.credentials = awsCredentials.default;
                    ec2Parser.parseMetrics(function() {
                        console.log("Parse Alert(ec2): Metrics parsing completed");
                        AWS.config.credentials = awsCredentials.default;
                        ec2Parser.parseInstances(function() {
                            console.log("Parse Alert(ec2): Instance parsing completed");
                            AWS.config.credentials = awsCredentials.dev2;
                            rdsParser.parseMetrics(function() {
                                console.log("Parse Alert(rds): Metrics parsing completed");
                                AWS.config.credentials = awsCredentials.dev2;
                                rdsParser.parseInstances(function() {
                                    console.log("Parse Alert(rds): Instance parsing completed");                                                      
                                }); 
                            });
                        });
                    });
                    s3.s3Watch();
                });
            });
        });
    });
};

s3.s3Watch = function() {
    console.log("Watching s3 bucket on timer of 60 minutes");
    setTimeout(self.s3Connect.bind(self), 1000 * 60 * 60);
};

exports.updateAWSRegion = function(newRegion) {
    AWS.config.update({
        region: newRegion
    });
    console.log("new awsRegion " + AWS.config.region);
}