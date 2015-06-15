//Query and update FREE TIER billing and update associated cost rates

//*Karl* -- Would it be better to instead do an upsert on each document to a new attribute?
var request = require("request");
var fs = require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var databaseUrl = 'mongodb://localhost:27017/awsdb';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Retrieve the proper pricing values
var pricingData = require('./BoxPricingCheck');
pricingData.getPricing();


var billingSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    ProductName: String,
    Cost: Number,
    ResourceId: String,
    UsageStartDate: String,
    "user:Volume Id": String,
    Rate: Number,
    UsageType: String,
    ItemDescription: String,
    UsageQuantity: Number,
    RateId: Number,
    NonFreeRate: Number

});
var nModified = 0;
var ProductSchema = new Schema({
    ProductName: {
        type: String
    },
    OS: {
        type: String,
        default: null
    }, // (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name']);
    AvailabilityZone: {
        type: String,
        required: true
    }, // (pricingJSON.config.regions[region]['region']);
    tierName: {
        type: String,
        required: true
    }, //(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size]['size'])
    typeName: {
        type: String
    },
    prices: {
        type: Number,
        required: true
    }, //(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].prices.USD);
    date: {
        type: Date,
        default: Date()
    }, //Date field added for insert reference
    storageType: {
        type: String
    }
});

var billingModel = mongoose.model('billingModel', billingSchema, 'bills201506');
var pricingModel = mongoose.model('pricingModel', ProductSchema, 'pricing');
// console.log(pricingModel.find({}));

var updateBillingValues = function(pricingQuery, billingQuery, callback) {
    var pricingScope = {_id:0, Price : 1};
    pricingModel.find(pricingQuery, pricingScope).exec(function(err, price) {
        
        if (err) {
            throw err;
        } else {
            billingModel.find(billingQuery).exec(function(e, d) {
                if (e) {
                    throw e;
                } else {
                    // console.log(pricingQuery);
                var priceString = price[0].toString();
                var nonFreeRate = parseFloat(priceString.substring(priceString.indexOf(':')+2,priceString.length-2));
                console.log(typeof price[0], price[0]);
                    for (var i in d) {

                        // console.log(d);
                        var m = new billingModel({
                            
                            _id: d[i]._id,
                            ProductName: d[i].ProductName,
                            Cost: d[i].Cost,
                            ResourceId: d[i].ResourceId,
                            UsageStartDate: d[i].UsageStartDate,
                            "user:Volume Id": d[i]['user:Volume Id'],
                            Rate: d[i].Rate,
                            UsageType: d[i].UsageType,
                            ItemDescription: d[i].ItemDescription,
                            UsageQuantity: d[i].UsageQuantity,
                            RateId: d[i].RateId,
                            NonFreeRate: nonFreeRate
                        });
                        // console.log("Document set " + d[i].ProductName + " updated.");
                        //Switch over to rate IDs for billing queries at some point.
                        var upsertData = m.toObject();
                        billingModel.update({
                            _id: m.id
                        }, upsertData, {
                            upsert: true,
                            multi: true
                        }, function(err, op) {
                            if (err) {
                                throw err;
                            } else {
                                //console.log(op);
                            }
                        });
                    }
                }
            });
        }
    });
}

exports.freeTier = function(req, res) {
    var db = mongoose.connection;
    billingModel.aggregate({
        $match: {
            ItemDescription: {
                $regex: /free tier/
            }
        }
    }, {
        $group: {
            _id: "$RateId",
            ItemDescription: {
                $addToSet: "$ItemDescription"
            },
            UsageType: {
                $addToSet: "$UsageType"
            }
        }
    }).exec(function(e, d) {
        if (e) {
            console.error(e.message);
            console.error(e.stack);
        }
        // console.log(d);
        var conditions;
        var update;
        var options;
        for (var r in d) {

            var UsageType = d[r].UsageType[0];
            var ItemDescription = d[r].ItemDescription[0];
            // console.log(UsageType + "\t" + ItemDescription);

            switch (true) {
                // //value == .09
                case (/DataTransfer-Out-Bytes/.test(UsageType)):
                    console.log("matched /DataTransfer-Out-Bytes/");
                    var pricingQuery = {
                        TierName: 'upTo10TBout'
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /DataTransfer-Out-Bytes/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);

                    break;

                    //     //value.price should == .02
                case (/DataTransfer-Regional-Bytes/.test(UsageType)):
                    console.log("matched /DataTransfer-Regional-Bytes/");


                    var pricingQuery = {
                        TierName: "crossRegion",
                        TypeName: "dataXferOutEC2"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /DataTransfer-Regional-Bytes/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;
                    //     //value.price should == 0.02 
                    //     //http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js
                case (/AWS-Out-Bytes/.test(UsageType)):
                    console.log("matched /AWS-Out-Bytes/");
                    var pricingQuery = {
                        TierName: "crossRegion",
                        TypeName: "dataXferOutEC2"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: 'AWS-Out-Bytes'
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery, function(){
                        console.log("Updated AWS-Out-Bytes values");
                    });
                    break;

                    //value.price should == 0.017

                case (/InstanceUsage:db.t2.micro/.test(UsageType)): //InstanceUsage is for RDS
                    console.log("matched /InstanceUsage:db.t2.micro/");

                    var pricingQuery = {
                        TierName: "db.t2.micro"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /InstanceUsage:db.t2.micro/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //Mongo Queries have been completed up to this point. BoxPricingCheck does not have EBS functionality
                    //     //value.price should == .005
                case (/Requests-Tier1/.test(UsageType)):
                    console.log("matched /Request-Tier1/");

                    var pricingQuery = {
                        TierName: "putcopypost"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /Requests-Tier1/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //value.price should == 0.004
                case (/Requests-Tier2/.test(UsageType)):
                    console.log("matched /Request-Tier2/");
                    var pricingQuery = {
                        TierName: "getEtc"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /Requests-Tier2/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //value.price should == .1
                case (/EBS:VolumeUsage.gp2/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");

                    var pricingQuery = {
                        TypeName: "Amazon EBS General Purpose (SSD) volumes"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /EBS:VolumeUsage.gp2/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //value.price should == 0.03
                case (/TimedStorage-ByteHrs/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");

                    var pricingQuery = {
                        TierName: "firstTBstorage"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /TimedStorage-ByteHrs/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     ////value.price should == .115
                case (/RDS:GP2-Storage/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");

                    var pricingQuery = {
                        TierName: "db.m1.small"
                    };
                    var billingQuery = {
                        UsageType: {
                            $regex: /RDS:GP2-Storage/
                        },
                        ItemDescription: {
                            $regex: /free tier/
                        }
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                case (/BoxUsage:t2.micro/.test(UsageType)): //BoxUsage is for EC2
                    console.log("matched /BoxUsage:t2.micro/");
                    if (/Windows/.test(ItemDescription)) {
                        console.log("matched /Windows/");
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "mswin"
                        };
                        var billingQuery = {
                            UsageType: {
                                $regex: /t2.micro/
                            },
                            ItemDescription: {
                                $regex: /Windows t2.micro/
                            }
                        };
                        updateBillingValues(pricingQuery, billingQuery);

                    } else if (/SUSE/.test(ItemDescription)) {
                        console.log("matched /SUSE/")
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "sles"
                        };
                        var billingQuery = {
                            UsageType: {
                                $regex: /t2.micro/
                            },
                            ItemDescription: {
                                $regex: /per SUSE Linux t2.micro/
                            }
                        };
                        updateBillingValues(pricingQuery, billingQuery);

                    } else if (/Linux/.test(ItemDescription)) {
                        console.log("matched /Linux/")
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "linux"
                        };
                        var billingQuery = {
                            UsageType: {
                                $regex: /t2.micro/
                            },
                            ItemDescription: {
                                $regex: /per Linux t2.micro/
                            }
                        };
                        updateBillingValues(pricingQuery, billingQuery);
                        break;
                    } else if (/RHEL/.test(ItemDescription)) {
                        console.log("matched /RHEL/")
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "rhel"
                        };
                        var billingQuery = {
                            UsageType: {
                                $regex: /t2.micro/
                            },
                            ItemDescription: {
                                $regex: / RHEL t2.micro/
                            }
                        };
                        updateBillingValues(pricingQuery, billingQuery);
                        break;
                    }

            }
        }
        // res.send("Done updating free tier rates");
    });

}