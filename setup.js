var AWS = require('aws-sdk');
var fs = require('fs');
var adm = require('adm-zip');
var ec2Parser = require('./src/server/parse/ec2Parse');
var rdsParser = require('./src/server/parse/rdsParse');
var iamParser = require('./src/server/parse/iamParse');
var billingParser = require('./src/server/parse/billingParse');
var boxPricingParser = require('./src/server/parse/boxPricingParse');
require('./src/server/config');
var batch = [],
    groups = [],
    users = [];

//create /data directory
if (!fs.existsSync(process.cwd() + '/data')) {
    fs.mkdirSync(process.cwd() + '/data');
}

mongoose.connect(databaseUrl, function(error) {
    if (error) {
        console.log(error);
    }
});

var setupServer = function() {
    console.log('SetupAlert: setting up database');
    setupDatabase(function() {
        console.log('SetupAlert: parsing instances');
        AWS.config.credentials = awsCredentials.default;
        parseInstances(function() {
            console.log('SetupAlert: parsing metrics');
            parseMetrics(function() {
                console.log('SetupAlert: parsing groups and users');
                parseUsersGroups(function() {
                    console.log('SetupAlert: parsing box pricing');
                    parseBoxPricing(function() {
                        console.log('SetupAlert: parsing bills');
                        parseBills(function() {
                            console.log('Setup script completed, You may now start the server');
                            process.exit(0);
                        });
                    })
                });
            });
        });
    });
};

var setupDatabase = function(callback) {
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
            time: '2015-01-01 00:00:00'
            // time: _time 
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
                        db.createCollection('notifications', function(err, collection) {
                            if (err) throw err;
                            console.log("DatabaseAlert: 'notifications' collection created");
                            callback();
                        });
                    });
                });
            });
        });
    });
}

var parseInstances = function(callback) {
    rdsParser.parseInstances(function() {
        console.log('ParseAlert(rds): Instance parsing completed');
        ec2Parser.parseInstances(function() {
            console.log('ParseAlert(ec2): Instance parsing completed');
            callback();
        });
    });
};

var parseMetrics = function(callback) {
    rdsParser.parseMetrics('setup', function(err) {
        if (err) throw err;
        console.log('ParseAlert(rds): Metrics parsing completed');
        ec2Parser.parseMetrics('setup', function(err) {
            if (err) throw err;
            console.log('ParseAlert(ec2): Metrics parsing completed');
            callback();
        });
    });
}

var parseUsersGroups = function(callback) {
    iamParser.parseGroups(function() {
        iamParser.parseUsers(function() {
            iamParser.parseUserGroups(function() {
                console.log('ParseAlert(iam): Users and Groups parsing completed');
                callback();
            });
        });
    });
}

var parseBoxPricing = function(callback) {
    boxPricingParser.getPricing(function() {
        callback();
    })
}

var parseBills = function(callback) {
    var _params = {
        Bucket: s3Bucket
    };
    AWS.config.region = s3Region;
    var s3 = new AWS.S3();
    s3.listObjects(_params, function(err, data) {
        if (err) throw err;
        var billDataSheetIndex = [];
        for (var i = 0 in data.Contents) {
            if (/aws-billing-detailed-line-items-with-resources-and-tags/.test(data.Contents[i].Key))
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

                            // parseBillingCSVUsersGroups(function() {
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

//temporary method to add random group and users to bills
var parseBillingCSVUsersGroups = function(callback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        db.collection('latest').findOne(function(err, latest) {
            mongoose.model('iamUsers').find(function(err, du) {
                users = du;
                mongoose.model('iamGroups').find(function(err, dg) {
                    groups = dg;
                    fs.readFile(process.cwd() + '/data/latestBills.csv', "utf8", function(error, text) {
                        if (error) throw error;
                        var lines = text.split("\n");
                        lines.pop();
                        var header = lines[0].split('\",\"');
                        header[0] = header[0].replace(/"/g, "");
                        header[header.length - 1] = header[header.length - 1].replace(/"/g, "");
                        var numericPropertiesIndex = [];
                        var propertiesIndex = [];
                        var newDocCount = 0;
                        for (var i = 0; i < header.length; ++i) header[i] = header[i];
                        for (var i = 0; i < billingAttributes.length; ++i) propertiesIndex.push(header.indexOf(billingAttributes[i]));
                        for (var i = 0; i < numericAttirbutes.length; ++i) numericPropertiesIndex.push(billingAttributes.indexOf(numericAttirbutes[i]));
                        //excluding header
                        var index1 = 1;
                        var controller1 = function() {
                            iterator1(function() {
                                index1++;
                                if (index1 < lines.length) {
                                    controller1();
                                } else {
                                    if (newDocCount > 0)
                                        console.log("Database Alert: " + newDocCount + " documents added to 'lineItems'");
                                    callback();
                                }
                            });
                        };
                        var iterator1 = function(callback1) {
                            getRandomBatch(function() {
                                //replaces ',,' with ',"null",'
                                lines[index1] = lines[index1].replace(/,,/g, ",\"null\",");
                                //replaces remaining ',,' with ',"null",'
                                lines[index1] = lines[index1].replace(/,,/g, ",\"null\",");
                                //replaces ending ',' with ',"null"'
                                if (lines[index1].match(/,$/)) lines[index1] += "\"null\"";
                                //replaces '""' with '"null"'
                                lines[index1] = lines[index1].replace(/""/g, "\"null\"");
                                //split lines by '","'
                                bill = lines[index1].split("\",\"");
                                //remove leading '"'
                                bill[0] = bill[0].replace(/"/g, "");
                                //remove trailing '"'
                                bill[bill.length - 1] = bill[bill.length - 1].substring(0, bill[bill.length - 1].length - 1);
                                if (bill[propertiesIndex[billingAttributes.indexOf('UsageQuantity')]] != "null") {
                                    if (bill[propertiesIndex[billingAttributes.indexOf('UsageStartDate')]] > latest.time) {
                                        ++newDocCount;
                                        var doc = {};
                                        for (var j = 0; j < billingAttributes.length; ++j) {
                                            if (numericPropertiesIndex.indexOf(j) == -1) {
                                                doc[billingAttributes[j]] = bill[propertiesIndex[j]];
                                            } else {
                                                doc[billingAttributes[j]] = parseFloat(bill[propertiesIndex[j]]);
                                            }
                                        }
                                        //handles free tier rate and cost
                                        if (doc['ItemDescription'].match(/free tier/g)) {
                                            if (/BoxUsage:t2.micro/.test(doc['UsageType'])) {
                                                var zone = doc['AvailabilityZone'];
                                                if (/[a-z]$/.test(zone)) zone = zone.substring(0, zone.length - 1);
                                                if (/Windows/.test(doc['ItemDescription'])) {
                                                    doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['Windows'][zone];
                                                } else if (/SUSE/.test(doc['ItemDescription'])) {
                                                    doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['SUSE'][zone];
                                                } else if (/Linux/.test(doc['ItemDescription'])) {
                                                    doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['Linux'][zone];
                                                } else if (/RHEL/.test(doc['ItemDescription'])) {
                                                    doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['RHEL'][zone];
                                                }
                                            } else if (/AWS-Out-Bytes/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['AWS-Out-Bytes'].Price;
                                            } else if (/EBS:VolumeUsage.gp2/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['EBS:VolumeUsage.gp2'].Price;
                                            } else if (/DataTransfer-Out-Bytes/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['DataTransfer-Out-Bytes'].Price;
                                            } else if (/TimedStorage-ByteHrs/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['TimedStorage-ByteHrs'].Price;
                                            } else if (/CloudFront-Out-Bytes/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['CloudFront-Out-Bytes'].Price;
                                            } else if (/DataTransfer-Regional-Bytes/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['DataTransfer-Regional-Bytes'].Price;
                                            } else if (/Requests-Tier1/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['Requests-Tier1'].Price;
                                            } else if (/Requests-Tier2/.test(doc['UsageType'])) {
                                                doc['NonFreeRate'] = pricing['Requests-Tier2'].Price;
                                            } else {
                                                doc['NonFreeRate'] = pricing[doc['UsageType']].Price;
                                            }
                                            doc['NonFreeCost'] = doc['UsageQuantity'] * doc['NonFreeRate'];
                                        }
                                        if (batch[0] == 0) {
                                            doc['user:Group'] = 'null';
                                            doc['user:Name'] = batch[1];
                                        } else {
                                            doc['user:Group'] = batch[1];
                                            doc['user:Name'] = batch[2];
                                        }
                                        db.collection('lineItems').insert(doc, function() {
                                            db.collection('latest').update({
                                                _id: latest._id
                                            }, {
                                                time: bill[propertiesIndex[billingAttributes.indexOf('UsageStartDate')]]
                                            }, function() {
                                                setTimeout(function() {
                                                    callback1();
                                                }, 0);
                                            });
                                        });
                                    } else {
                                        setTimeout(function() {
                                            callback1();
                                        }, 0);
                                    }
                                } else callback1();
                            });
                        };
                        controller1();
                    });
                });
            });
        });
    });
};

var getRandomBatch = function(callback) {
    batch = [];
    var mrand = parseInt((Math.random() * 10));
    if (mrand % 2 == 0) {
        var rand = parseInt((Math.random() * 100)) % users.length;
        var uname = users[rand].UserName;
        batch.push(0);
        batch.push(uname);
        callback();
    } else {
        var rand = parseInt((Math.random() * 100)) % groups.length;
        var gname = groups[rand].GroupName;
        mongoose.model('iamUsersGroups').find({
            GroupName: gname
        }).exec(function(e, d) {
            var grand = parseInt((Math.random() * 100)) % d.length;
            var guname = d[grand].UserName;
            batch.push(1);
            batch.push(gname);
            batch.push(guname);
            callback();
        });
    }
}

setupServer();
// parseInstances(function() {
//     console.log('SetupAlert: parsing metrics');
//     process.exit(0);
// });