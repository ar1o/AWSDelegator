var fs = require("fs");
var adm = require('adm-zip');
var billingParser = require('./billingParse');
var ec2Parser = require('./ec2Parse');
var rdsParser = require('./rdsParse');
var self = this;
var s3 = new AWS.S3();
var _params = {
    Bucket: s3Bucket
};

exports.s3Connect = function(_callback) {
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
        mongoose.model('latest').find({}, function(e, d) {
            //get currentBillingCollection from 'latest' collection
            if (e) throw e;
            //time: yyyy-mm-dd hh:mm:ss
            var latestTime = d[0].time;
            latestTime.substring(0, latestTime.indexOf(' '));
            var time = latestTime.split('-');
            currentBillingCollection = 'bills' + time[0] + time[1];
            var year,nextYear,month,nextMonth;
            year = parseInt(time[0]);
            month = parseInt(time[1]);
            month=12;
            if(month==12){
                nextYear = year+1;
                nextMonth = 1;
            }else{
                nextYear = year;
                nextMonth = month+1;
            }
            if(nextMonth < 10)nextMonth='0'+String(nextMonth);
            else{
                nextMonth = String(nextMonth);
                nextYear = String(nextYear);
            }
            AWS.config.region = s3Region;
            s3.listObjects(_params, function(err, data) {
                if (err) throw err;
                var okey = awsAccountNumber+'-aws-billing-detailed-line-items-with-resources-and-tags-'+time[0]+'-'+time[1]+'.csv.zip';
                var _okey = awsAccountNumber+'-aws-billing-detailed-line-items-with-resources-and-tags-'+nextYear+'-'+nextMonth+'.csv.zip';
                for(var i in data.Contents){                    
                    if (data.Contents[i].Key==_okey){
                        okey = _okey;
                    }
                }
                var params = {
                    Bucket: s3Bucket,
                    Key: okey
                };
                var datasheet = fs.createWriteStream('datasheet.zip');
                s3.getObject(params).createReadStream().pipe(datasheet);
                datasheet.on('close', function() {
                    var unzip = new adm('datasheet.zip');
                    try {
                        unzip.extractAllTo("data", true);
                    } catch (e) {
                        console.log(e);
                    }
                    fs.readdir(process.cwd() + '/data/', function(err, files) {
                        if (err) throw err;
                        fs.rename(process.cwd() + '/data/' + files[0], process.cwd() + '/data/latestBills.csv', function(err) {
                            if (err) console.log('ERROR: ' + err);
                            console.log(files[0] + " renamed to latestBills.csv");
                        });
                        billingParser.parseBillingCSV(function() {   
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