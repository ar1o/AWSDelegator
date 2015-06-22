var fs = require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var freeTier = require('../FreeTier');

// parses latestBills.csv and updates the 'awsdb' database with new bills.
exports.parseBillingCSV = function(_callback) {
    console.log("Parse Alert(Billing): CSV parsing initiated");
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
                    for (var i = 1; i < lines.length; ++i) {
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
                                // if(doc['ItemDescription'].match(/free tier/g)){
                                //     var pricingQuery = freeTier.GetNonFreePricing(doc);
                                //     var pricingScope = {_id:0, Price : 1};
                                //     console.log(pricingQuery);
                                //     mongoose.model('pricingModel').findOne(pricingQuery, pricingScope).exec(function(err, price) {
                                //         if (err) {
                                //             throw err;
                                //         } else {
                                //             console.log(price);
                                //             doc['NonFreeRate'] = price.Price;
                                //             doc['NonFreeCost'] = price.Price * doc[billingAttributes['UsageQuantity']];
                                //             console.log(price.Price);
                                //         }
                                //     });
                                //     console.log(doc);
                                // }         
                                db.collection(currentBillingCollection).insert(doc);
                                db.collection('latest').update({
                                    _id: latest._id
                                }, {
                                    time: bill[propertiesIndex[billingAttributes.indexOf('UsageStartDate')]]
                                });
                            }
                        }
                    }                        
                    console.log("Database Alert: "+newDocCount+" documents added to "+currentBillingCollection);
                    _callback();
                });
            });
        }
    });
};