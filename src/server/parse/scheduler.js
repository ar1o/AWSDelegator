var fs = require("fs");
var adm = require('adm-zip');
var billingParser = require('./billingParse');
var ec2Parser = require('./ec2Parse');
var rdsParser = require('./rdsParse');
var iamParser = require('./iamParse');
var self = this;
var okey,next_okey;
var s3 = new AWS.S3();
var _params = {
    Bucket: s3Bucket
};

exports.s3Connect = function(_callback) {
    s3.s3Watch();    
    parseBills();
    parseAWSServices();
};

var parseBills = function() {
    console.log('ParseAlert(bills): billing parse initiated');
    deleteLatestBills(function(){
        getOkey(function(){
            getBillingCSV(function(){
                renameCSV(function(){
                    parseBillings(function(){
                        console.log('ParseAlert(bills): billing parse completed');
                    });
                });
            });
        });
    });
}

var parseAWSServices = function() {
    console.log('ParseAlert(ec2): parsing initiated');
    AWS.config.credentials = awsCredentials.default;
    parseEC2(function() {
        console.log('ParseAlert(ec2): parsing completed');
        console.log('ParseAlert(rds): parsing initiated');
        AWS.config.credentials = awsCredentials.dev2;
        parseRDS(function() {
            console.log('ParseAlert(rds): parsing completed');
            console.log('ParseAlert(iam): parsing initiated');
            AWS.config.credentials = awsCredentials.dev2;
            parseIAM(function() {
                console.log('ParseAlert(iam): parsing completed');
            });
        })
    });
}

var deleteLatestBills = function(callback){
    var maindir = process.cwd();
    maindir = maindir.substring(0,maindir.lastIndexOf('/'));
    fs.readdir(maindir +'/data/', function(err, files) {
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
        }else
            callback();       
    });
}

var getOkey = function(callback){
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

var getBillingCSV = function(callback){
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

var renameCSV = function(callback){
    fs.readdir(process.cwd() + '/data/', function(err, files) {
        if (err) throw err;
        fs.rename(process.cwd() + '/data/' + files[0], process.cwd() + '/data/latestBills.csv', function(err) {
            if (err) console.log('ERROR: ' + err);
            console.log(files[0] + " renamed to latestBills.csv");
            callback();
        });        
    });
}

var parseBillings = function(callback){
    billingParser.parseBillingCSV(function() {        
        if (typeof _callback == "function") _callback();
        callback();
    });
}

var parseEC2 = function(callback) {
    //Parse 'metrics' before 'instances' as new instances 
    ec2Parser.parseMetrics('scheduler', function() {        
        // AWS.config.credentials = awsCredentials.default;
        ec2Parser.parseInstances(function() {            
            callback();
        });
    });
}

var parseRDS = function(callback) {
    rdsParser.parseMetrics('scheduler', function() { //Parse 'metrics' before 'instances' as new instances     
        // AWS.config.credentials = awsCredentials.dev2;
        rdsParser.parseInstances(function() {            
            callback();
        });
    });
}

var parseIAM = function(callback){    
    iamParser.parseGroups(function(){        
        // AWS.config.credentials = awsCredentials.dev2;
        iamParser.parseUsers(function(){            
            callback();
        });
    });
}

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