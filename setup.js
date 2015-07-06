var AWS = require('aws-sdk');
var fs = require('fs');
var adm = require('adm-zip');
var ec2Parser = require('./src/server/parse/ec2Parse');
var rdsParser = require('./src/server/parse/rdsParse');
var iamParser = require('./src/server/parse/iamParse');
var billingParser = require('./src/server/parse/billingParse');
require('./src/server/config');

billingAttributes = ['RateId', 'ProductName', 'UsageType', 'Operation', 'AvailabilityZone', 'ItemDescription',
    'UsageStartDate', 'UsageQuantity', 'Rate', 'Cost', 'user:Volume Id', 'user:Name', 'user:Email', 'ResourceId'];
numericAttirbutes = ['RateId', 'UsageQuantity', 'Rate', 'Cost'];

//create /data directory
if (!fs.existsSync(process.cwd() + '/data')) {
    fs.mkdirSync(process.cwd() + '/data');
}

mongoose.connect(databaseUrl, function(error) {
    if (error) {
        console.log(error);
    }
});

var setupServer = function(){
<<<<<<< HEAD
    setupDatabase(function(){
        parseInstances(function(){
            parseMetrics(function(){
                parseBills(function(){
                    parseGroups(function(){
=======
    console.log('SetupAlert: setting up database');
    setupDatabase(function(){
        console.log('SetupAlert: parsing instances');
        parseInstances(function(){
            console.log('SetupAlert: parsing metrics');
            parseMetrics(function(){
                console.log('SetupAlert: parsing bills');
                parseBills(function(){
                    console.log('SetupAlert: parsing groups');
                    parseGroups(function(){
                        console.log('SetupAlert: parsing users');
>>>>>>> 440d7e1148728a9afd8c05f9c316737260f50c55
                        parseUsers(function(){
                            console.log("Setup script completed, You may now start the server");
                            process.exit(0);
                        });                        
                    });                    
                });
            });
        });
    });
};

var setupDatabase = function(callback){
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        console.log("DatabaseAlert: connected to ", databaseUrl);
        var currentTimeMilliseconds = (new Date).getTime();
        var currentTimeIso = new Date(currentTimeMilliseconds).toISOString();
        var currentTimeMilliseconds = (new Date).getTime();
        var currentTimeIso = new Date(currentTimeMilliseconds).toISOString();
        var _time = currentTimeIso.split('T');
        _time[1] = _time[1].substring(0, _time[1].indexOf('.'));
        _time = _time[0] + ' ' + _time[1];        
        db.collection('latest').save({
            _id: '1',
            time: '2015-01-01 00:00:00'
        });
        db.collection('usageMeter').save({
            _id: '1',
            time: _time
        });
        require('./src/server/model/ec2');
        require('./src/server/model/rds');        
        db.createCollection('ec2Instances', function(err, collection) {
            if (err) throw err;
            console.log("DatabaseAlert: 'ec2Instances' collection created");
            db.createCollection('rdsInstances', function(err, collection) {
                if (err) throw err;
                console.log("DatabaseAlert: 'rdsInstances' collection created");
                db.createCollection('iamGroups', function(err, collection) {
                    if (err) throw err;
                    console.log("DatabaseAlert: 'iamGroups' collection created");
                    db.createCollection('iamUsers', function(err, collection) {
                        if (err) throw err;
                        console.log("DatabaseAlert: 'iamUsers' collection created");
                        callback();
                    });
                });
            });
        });
    });
}

var parseInstances = function(callback){
    AWS.config.credentials = awsCredentials.dev2;
    rdsParser.parseInstances(function() {
<<<<<<< HEAD
        console.log('Parse Alert(rds): Instance parsing completed');
        AWS.config.credentials = awsCredentials.default;
        ec2Parser.parseInstances(function() {
            console.log('Parse Alert(ec2): Instance parsing completed');
=======
        console.log('ParseAlert(rds): Instance parsing completed');
        AWS.config.credentials = awsCredentials.default;
        ec2Parser.parseInstances(function() {
            console.log('ParseAlert(ec2): Instance parsing completed');
>>>>>>> 440d7e1148728a9afd8c05f9c316737260f50c55
            callback();
        });
    });
};

var parseMetrics = function(callback){
    AWS.config.credentials = awsCredentials.dev2;
    rdsParser.parseMetrics('setup', function(err) {
        if (err) throw err;
<<<<<<< HEAD
        console.log('Parse Alert(rds): Metrics parsing completed');
=======
        console.log('ParseAlert(rds): Metrics parsing completed');
>>>>>>> 440d7e1148728a9afd8c05f9c316737260f50c55
        AWS.config.credentials = awsCredentials.default;
        ec2Parser.parseMetrics('setup', function(err) {
            if(err) throw err;
            require('./src/server/BoxPricingCheck').getPricing(function() {
<<<<<<< HEAD
                console.log('Parse Alert(ec2): Metrics parsing completed');
                console.log('Parse Alert(BoxPricingCheck): BoxPricing parsing completed');
=======
                console.log('ParseAlert(ec2): Metrics parsing completed');
                console.log('ParseAlert(BoxPricingCheck): BoxPricing parsing completed');
>>>>>>> 440d7e1148728a9afd8c05f9c316737260f50c55
                callback();
            });                
        });
    });
}

var parseBills = function(callback){
    var _params = {
        Bucket: s3Bucket
    };
    AWS.config.region = s3Region;
    var s3 = new AWS.S3();
    s3.listObjects(_params, function(err, data) {
        if (err) throw err;
        var billDataSheetIndex = [];
        for(var i=0 in data.Contents){
            if(/aws-billing-detailed-line-items-with-resources-and-tags/.test(data.Contents[i].Key))
                billDataSheetIndex.push(i);
        }        
        var index = 0;
        var controller = function() {
            iterator(function() {
                index++;
                if (index < billDataSheetIndex.length) controller();
                else {                    
                    callback();
                }                
            });
        };
        var iterator = function(_callback) {            
            s3.listObjects(_params, function(err, data) {
                if (err) throw err;            
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
                    var datasheet = fs.createWriteStream('datasheet.zip');
                    var params = {
                        Bucket: s3Bucket,
                        Key: data.Contents[billDataSheetIndex[index]].Key
                    };
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
                                _callback();
                            }); 
                        });
                    });
                });
            });
        };
        controller();
    });          
};

var parseGroups = function(callback){    
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        AWS.config.credentials = awsCredentials.dev2;
        var iam = new AWS.IAM();
        iam.listGroups({}, function(err, iamGroups) {
            if (err) throw err;
            for (var i=0 in iamGroups.Groups) {
                var doc = {
                    Path: iamGroups.Groups[i].Path,
                    GroupName: iamGroups.Groups[i].GroupName,
                    GroupId: iamGroups.Groups[i].GroupId,
                    Arn: iamGroups.Groups[i].Arn,
                    CreateDate: iamGroups.Groups[i].CreateDate,
<<<<<<< HEAD
                    Credits: 0
=======
                    Amount: 0
>>>>>>> 440d7e1148728a9afd8c05f9c316737260f50c55
                };
                db.collection('iamGroups').insert(doc);            
            }
            callback();
        });
    });
}

var parseUsers = function(callback){
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        AWS.config.credentials = awsCredentials.dev2;
        var iam = new AWS.IAM();
        iam.listUsers({}, function(err, iamUsers) {
            if (err) throw err;
            for (var i=0 in iamUsers.Users) {
                var doc = {
                    Path: iamUsers.Users[i].Path,
                    UserName: iamUsers.Users[i].UserName,
                    UserId: iamUsers.Users[i].UserId,
                    Arn: iamUsers.Users[i].Arn,
                    CreateDate: iamUsers.Users[i].CreateDate,
<<<<<<< HEAD
                    Credits: 0                    
=======
                    Amount: 0                    
>>>>>>> 440d7e1148728a9afd8c05f9c316737260f50c55
                };
                db.collection('iamUsers').insert(doc);            
            }
            callback();
        });
    });
}

setupServer();