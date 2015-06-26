var fs = require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// parses latestBills.csv and updates the 'awsdb' database with new bills.
exports.parseBillingCSV = function(callback) {
    console.log("Parse Alert(Billing): Billing CSV parsing initiated");
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to ', databaseUrl);   
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
                    var i = 1;
                    var controller2 = function(){
                        iterator2(function(){
                            i++;
                            if(i < lines.length) {
                                controller2();
                            }
                            else{
                                console.log("Database Alert: "+newDocCount+" documents added to 'lineItems'");
                                callback();
                            }
                        });
                    };
                    var iterator2 = function(_callback){
                        // console.log("iterator2",i,lines.length);
                         //replaces ',,' with ',"null",'
                        lines[i] = lines[i].replace(/,,/g, ",\"null\",");
                        //replaces remaining ',,' with ',"null",'
                        lines[i] = lines[i].replace(/,,/g, ",\"null\",");
                        //replaces ending ',' with ',"null"'
                        if (lines[i].match(/,$/)) lines[i] += "\"null\"";
                        //split lines by '","'
                        bill = lines[i].split("\",\"");
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
                                if(doc['ItemDescription'].match(/free tier/g)){
                                    if(/BoxUsage:t2.micro/.test(doc['UsageType'])){
                                        if(/Windows/.test(doc['ItemDescription'])){
                                            doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['Windows'].Price;
                                        }else if(/SUSE/.test(doc['ItemDescription'])){
                                            doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['SUSE'].Price;
                                        }else if(/Linux/.test(doc['ItemDescription'])){
                                            doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['Linux'].Price;
                                        }else if(/RHEL/.test(doc['ItemDescription'])){
                                            doc['NonFreeRate'] = pricing['BoxUsage:t2.micro']['RHEL'].Price;
                                        }
                                    }else if(/AWS-Out-Bytes/.test(doc['UsageType'])){
                                        doc['NonFreeRate'] = pricing['AWS-Out-Bytes'].Price;
                                    }else if(/DataTransfer-Out-Bytes/.test(doc['UsageType'])){
                                        doc['NonFreeRate'] = pricing['DataTransfer-Out-Bytes'].Price;
                                    }else if(/TimedStorage-ByteHrs/.test(doc['UsageType'])){
                                        doc['NonFreeRate'] = pricing['TimedStorage-ByteHrs'].Price;
                                    }else if(/CloudFront-Out-Bytes/.test(doc['UsageType'])){
                                        doc['NonFreeRate'] = pricing['CloudFront-Out-Bytes'].Price;
                                    }else if(/DataTransfer-Regional-Bytes/.test(doc['UsageType'])){
                                        doc['NonFreeRate'] = pricing['DataTransfer-Regional-Bytes'].Price;
                                    }else if(/Requests-Tier1/.test(doc['UsageType'])){
                                        doc['NonFreeRate'] = pricing['Requests-Tier1'].Price;
                                    }else if(/Requests-Tier2/.test(doc['UsageType'])){
                                        doc['NonFreeRate'] = pricing['Requests-Tier2'].Price;
                                    }else{
                                        doc['NonFreeRate'] = pricing[doc['UsageType']].Price;                                    
                                    }
                                    doc['NonFreeCost'] = doc['UsageQuantity'] * doc['NonFreeRate'];
                                }    
                                 db.collection('lineItems').insert(doc,function(){
                                    db.collection('latest').update({
                                        _id: latest._id
                                    }, {
                                        time: bill[propertiesIndex[billingAttributes.indexOf('UsageStartDate')]]
                                    },function(){
                                        _callback();
                                    });
                                });                               
                            }else{
                                console.log("Database Alert: "+newDocCount+" documents added to 'lineItems'");
                                callback();
                            }
                        }else _callback();
                    };
                    controller2();                    
                });
            });
        }
    });
};