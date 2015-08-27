/*
    Scheduler is timed hourly to parse metrics, bills from aws and check for budget timeouts.
    This is the main file for delegating server activities. 
 */
var fs = require("fs");
var adm = require('adm-zip');
var billingParser = require('./billingParse');
var ec2Parser = require('./ec2Parse');
var rdsParser = require('./rdsParse');
var iamParser = require('./iamParse');
var timeOutHandler = require('../BudgetTimeOutHandler');
var grlsParser = require('./grlsParse');
var self = this;
var okey, next_okey;
var s3 = new AWS.S3();
var _params = {
    Bucket: s3Bucket
};

/*
    Main processing function that calls various actions.
 */
exports.s3Connect = function(_callback) {
    // Yep.
    printBanner();
    // Calls S3Connect every hour
    s3.s3Watch();
    // Connect to S3 bucket and grab latest hourly billing information.
    // parseBills();
    // Security credentials by AWS
    AWS.config.credentials = awsCredentials.default;
    // EC2, RDS and IAM stuff
    // parseAWSServices();
    // Check if quota for budgets costs has been reached.
    timeOutHandler.checkBudgets();
    // Check for quota on GRLS budgets has been reached.
    grlsParser.updateTimeBudgets();
};

/*
    Calls S3Connect every hour
 */
s3.s3Watch = function() {
    console.log("Watching s3 bucket on timer of 60 minutes");
    setTimeout(self.s3Connect.bind(self), 1000 * 60 * 60);
    if (credits != "EXPIRED") {
        setInterval(updateUsageBalance.bind(self), 1000 * 60 * 60);
    }
};

/*
    Connect to S3 bucket and grab latest hourly billing information.
 */
var parseBills = function() {
    console.log('ParseAlert(bills): billing parse initiated');
    deleteLatestBills(function() {
        getOkey(function() {
            getBillingCSV(function() {
                renameCSV(function() {
                    parseBillings(function() {
                        console.log('ParseAlert(bills): billing parse completed');
                    });
                });
            });
        });
    });
}

/*
    Heh.
 */
var printBanner = function() {
    var currentTimeMilliseconds = (new Date).getTime();
    var currentTimeIso = new Date(currentTimeMilliseconds).toISOString();
    console.log("     ___      _____ ___      _               _           ");
    console.log("    /_\\ \\    / / __|   \\ ___| |___ __ _ __ _| |_ ___ _ _ ");
    console.log("   / _ \\ \\/\\/ /\\__ \\ |) / -_) / -_) _` / _` |  _/ _ \\ '_|");
    console.log("  /_/ \\_\\_/\\_/ |___/___/\\___|_\\___\\__, \\__,_|\\__\\___/_|  ");
    console.log("       " + currentTimeIso + "   |___/                  \n");
}

/*
    EC2, RDS and IAM stuff
 */
var parseAWSServices = function() {
    console.log('ParseAlert(ec2): parsing initiated');
    parseEC2(function() {
        console.log('ParseAlert(ec2): parsing completed');
        console.log('ParseAlert(rds): parsing initiated');
        parseRDS(function() {
            console.log('ParseAlert(rds): parsing completed');
            console.log('ParseAlert(iam): parsing initiated');
            parseIAM(function() {
                console.log('ParseAlert(iam): parsing completed');
            });
        })
    });
}

/*
    Delete the .csv file once parsed.
 */
var deleteLatestBills = function(callback) {
    fs.readdir(process.cwd() + '/data/', function(err, files) {
        if (err) throw err;
        var latestBillsindex = files.indexOf('latestBills.csv');
        if (latestBillsindex != -1) {
            try {
                fs.unlink(process.cwd() + '/data/' + files[latestBillsindex], function(unlink_err) {
                    if (unlink_err) throw unlink_err;
                    callback();
                });
            } catch (err) {
                throw err;
            }
        } else
            callback();
    });
}

/*
   Look up object key of the .csv file in the designated S3 bucket
 */
var getOkey = function(callback) {
        mongoose.model('latest').find({}, function(e, d) {
            //get currentBillingCollection from 'latest' collection
            if (e) throw e;
            //time: yyyy-mm-dd hh:mm:ss
            var latestTime = d[0].time;
            latestTime.substring(0, latestTime.indexOf(' '));
            var time = latestTime.split('-');
            currentBillingCollection = 'bills' + time[0] + time[1];
            var year, nextYear, month, nextMonth;
            year = parseInt(time[0]);
            month = parseInt(time[1]);
            if (month == 12) {
                nextYear = year + 1;
                nextMonth = 1;
            } else {
                nextYear = year;
                nextMonth = month + 1;
            }
            if (nextMonth < 10) {
                nextMonth = '0' + String(nextMonth);
                nextYear = String(nextYear);
            } else {
                nextMonth = String(nextMonth);
                nextYear = String(nextYear);
            }
            okey = awsAccountNumber + '-aws-billing-detailed-line-items-with-resources-and-tags-' + time[0] + '-' + time[1] + '.csv.zip';
            next_okey = awsAccountNumber + '-aws-billing-detailed-line-items-with-resources-and-tags-' + nextYear + '-' + nextMonth + '.csv.zip';
            callback();
        });
    }
    /*
        Download the CSV .zip file and unzip it in the designated folder
     */
var getBillingCSV = function(callback) {
    AWS.config.region = s3Region;
    s3.listObjects(_params, function(err, data) {
        if (err) throw err;
        for (var i in data.Contents) {
            if (data.Contents[i].Key == next_okey) {
                okey = next_okey;
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
                callback();
            } catch (e) {
                console.log(e);
            }
        });
    });
}

/*
    Call it latestbills.csv
 */
var renameCSV = function(callback) {
    fs.readdir(process.cwd() + '/data/', function(err, files) {
        if (err) throw err;
        fs.rename(process.cwd() + '/data/' + files[0], process.cwd() + '/data/latestBills.csv', function(err) {
            if (err) console.log('ERROR: ' + err);
            console.log('billingCsv:', files[0]);
            callback();
        });
    });
}

/*
    Start parsing the .csv file
 */
var parseBillings = function(callback) {
    billingParser.parseBillingCSV(function() {
        callback();
    });
}

/*
    Parse EC2 instances and get their accosicated metrics
 */
var parseEC2 = function(callback) {
    //Parse 'metrics' before 'instances' as new instances 
    ec2Parser.parseMetrics('scheduler', function() {
        ec2Parser.parseInstances(function() {
            callback();
        });
    });
}

/*
    Parse RDS instances and get their accosicated metrics

 */
var parseRDS = function(callback) {
    //Parse 'metrics' before 'instances' as new instances    
    rdsParser.parseMetrics('scheduler', function() {
        rdsParser.parseInstances(function() {
            callback();
        });
    });
}

/*
    Parse IAM instances and get their accosicated metrics
 */
var parseIAM = function(callback) {
    iamParser.parseGroups(function() {
        iamParser.parseUsers(function() {
            iamParser.parseUserGroups(function() {
                callback();
            });
        });
    });
}

exports.updateAWSRegion = function(newRegion) {
    AWS.config.update({
        region: newRegion
    });
    console.log("new awsRegion " + AWS.config.region);
};

var updateUsageBalance = function() {
    var meter = require('../route/meterRoute');
    var config = require('../route/CredentialsRoute');
    var balance = config.getAccountBalance();
    var used = config.getCreditsUsed();
    mongoose.model('latest').find().exec(function(e, d) {
        if (e) throw e;
        var latestDate = new Date(d[0].time);
        var lastHour = latestDate.getTime();
        var lastHourTime = new Date(lastHour);
        var lastHourDate = lastHourTime.getFullYear() + '-' + checkDate((lastHourTime.getMonth() + 1)) + '-' +
            checkDate(lastHourTime.getDate()) + ' ' + checkDate(lastHourTime.getHours()) + ':' +
            checkDate(lastHourTime.getMinutes()) + ':' + checkDate(lastHourTime.getSeconds());
        var result = mongoose.model('Billings').aggregate([{
            $match: {
                UsageStartDate: {
                    $eq: lastHourDate
                }
            }
        }, {
            $project: {
                _id: 1,
                UsageStartDate: 1,
                Cost: 1
            }
        }, {
            $group: {
                _id: "$UsageStartDate",
                total: {
                    $sum: "$Cost"
                }
            }
        }], function(err, data) {
            rate = JSON.stringify(data);
            rate = rate.substr(38, 8);
            rate = Number(rate);
            balance = Number(balance);
            used = Number(used);
            if ((balance - rate) <= 0) {
                //console.log("balance dropped below zero");
                config.setCredits(0);
            } else {
                var nowD = new Date().getDate();
                var nowM = new Date().getMonth() + 1;
                var nowY = new Date().getFullYear();
                var now = new Date(nowY, nowM, nowD).toUTCString();
                //console.log("now", now);
                expData = config.getExpiration();
                var exp = new Date(expData.date[0].year, expData.date[0].month, expData.date[0].day).toUTCString();
                //console.log("exp", exp);
                if (nowY > expData.date[0].year || nowY == expData.date[0].year && nowM > expData.date[0].month || nowY == expData.date[0].year && nowM == expData.date[0].month && nowD > expData.date[0].day) {
                    //console.log("Credits have expired!");
                    config.setCredits("EXPIRED");
                } else if (now <= exp) {
                    //console.log("credits still good");
                    //console.log("Subtracting rate");
                    config.setCredits(balance - rate);
                    config.setUsed(used + rate);
                    config.setCredits(String(config.getAccountBalance().toFixed(2)));
                    config.setUsed(String(config.getCreditsUsed().toFixed(2)));
                } else {
                    //console.log("Not a good comparison between dates, or equal")
                }
                balance = config.getAccountBalance();
                used = config.getCreditsUsed();
                //console.log("NEW VALUES: \n\tbalance:", balance, "\n\tused:", used);
            }
        })
    });
};

var checkDate = function(val) {
    val = String(val);
    if (val < 10) val = '0' + val;
    return val;
};