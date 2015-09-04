/*
    This file derived information from the designated S3 bucket which holds
    hourly billing information in a .csv file. 
    The csv file is parsed and inserted into a database collection hourly.
 */
var fs = require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

/*
    parses latestBills.csv and updates the 'awsdb' database with new bills.
 */
exports.parseBillingCSV = function(callback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        db.collection('latest').findOne(function(err, latest) {
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
                    // console.log(bill);
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
                                } else if (/RDS:StorageIOUsage/.test(doc['UsageType'])) {
                                    doc['NonFreeRate'] = pricing['RDS:StorageIOUsage'].Price;
                                } else if (/InstanceUsage:db.t2.micro/.test(doc['UsageType'])) {
                                    doc['NonFreeRate'] = pricing['InstanceUsage:db.t2.micro'].Price;
                                } else if (/RDS:StorageUsage/.test(doc['UsageType'])) {
                                    doc['NonFreeRate'] = pricing['RDS:StorageUsage'].Price;
                                } else {
                                    //error checking
                                    if(pricing[doc['UsageType']] == undefined) {
                                        console.log("doc['UsageType']==",doc['UsageType']);
                                    } else {
                                        doc['NonFreeRate'] = pricing[doc['UsageType']].Price;
                                    }
                                }
                                doc['NonFreeCost'] = doc['UsageQuantity'] * doc['NonFreeRate'];
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
                    } else {
                        setTimeout(function() {
                                callback1();
                            }, 0);
                    }
                };
                controller1();
            });
        });
    });
};