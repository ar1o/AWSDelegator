var fs = require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var databaseUrl = 'mongodb://localhost:27017/awsdb';
var properties = ['RateId', 'ProductName', 'UsageType', 'Operation', 'AvailabilityZone', 'ItemDescription',
    'UsageStartDate', 'UsageQuantity', 'Rate', 'Cost', 'user:Volume Id', 'user:Name', 'user:Email', 'ResourceId'
];
var numericProperties = ['RateId', 'UsageQuantity', 'Rate', 'Cost'];

/*
* parses latestBills.csv and updates the 'awsdb' database with new bills.
*/
exports.parseBillingCSV = function(_callback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to ', databaseUrl);
            var MongoClient = require('mongodb').MongoClient;
            MongoClient.connect(databaseUrl, function(err, db) {
                if (err) throw err;
                db.collections(function(err, collections_) {
                    checkForLatestCollection(db,collections_);
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
                            for (var i = 0; i < properties.length; ++i) propertiesIndex.push(header.indexOf(properties[i]));
                            for (var i = 0; i < numericProperties.length; ++i) numericPropertiesIndex.push(properties.indexOf(numericProperties[i]));
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
                                if (bill[propertiesIndex[properties.indexOf('UsageQuantity')]] != "null") {
                                    if (bill[propertiesIndex[properties.indexOf('UsageStartDate')]] > latest.time) {
                                        ++newDocCount;
                                        var doc = {};
                                        for (var j = 0; j < properties.length; ++j) {
                                            if (numericPropertiesIndex.indexOf(j) == -1) {
                                                doc[properties[j]] = bill[propertiesIndex[j]];
                                            } else {
                                                doc[properties[j]] = parseFloat(bill[propertiesIndex[j]]);
                                            }
                                        }
                                        db.collection(currentCollection).insert(doc);
                                        db.collection('latest').update({
                                            _id: latest._id
                                        }, {
                                            time: bill[propertiesIndex[properties.indexOf('UsageStartDate')]]
                                        });
                                    }
                                }
                            }
                            _callback();
                            console.log("Database update: "+newDocCount+" documents added to "+currentCollection);
                        });
                    });
                });
            });
        }
    });
};

/*
 * checks if collection 'latest' is present in 'awsdb'. if not creates it.
 */
function checkForLatestCollection(db,collections) {
    var re = /latest/g;
    var flag = 0;
    for (var i in collections)
        if (re.exec(collections[i]['namespace'])) flag = 1;
    if (flag == 0) db.collection('latest').save({
        time: "2010:01:01 00:00:00"
    });
}