
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 

// var pricingModel = mongoose.model('pricingModel', ServiceSchema, 'pricing');


var updateBillingValues = function(pricingQuery, billingQuery, callback) {
    var pricingScope = {_id:0, Price : 1};
    mongoose.model('pricingModel').findOne(pricingQuery, pricingScope).exec(function(err, price) {
        if (err) {
            throw err;
        } else {
            mongoose.model('Billings').find(billingQuery).exec(function(e, d) {
                if (e) {
                    throw e;
                } else {
                    for (var i in d) {
                        var m = {
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
                            NonFreeRate: price.Price,
                            NonFreeCost: (price.Price * d[i].UsageQuantity)
                        };
                        //Switch over to rate IDs for billing queries at some point.
                        
                        mongoose.model('Billings').update({
                            _id: m._id
                        }, m, {
                            upsert: true,
                            multi: true
                        }, function(err, op) {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }
            });
        }
    });
}

exports.GetNonFreePricing = function(req, res) {
    var UsageType = req['UsageType'];
    var ItemDescription = req['ItemDescription'];
    switch (true) {
        case (/DataTransfer-Out-Bytes/.test(UsageType)):
            var pricingQuery = {
                TierName: 'upTo10TBout'
            };
            return pricingQuery;
            break;
        case (/DataTransfer-Regional-Bytes/.test(UsageType)):
            var pricingQuery = {
                TierName: "crossRegion",
                TypeName: "dataXferOutEC2"
            };
            return pricingQuery;
            break;
        case (/AWS-Out-Bytes/.test(UsageType)):
            var pricingQuery = {
                TierName: "crossRegion",
                TypeName: "dataXferOutEC2"
            };
            return pricingQuery;
            break;
        case (/InstanceUsage:db.t2.micro/.test(UsageType)):
            var pricingQuery = {
                TierName: "db.t2.micro"
            };
            return pricingQuery;
            break;
        // Mongo Queries have been completed up to this point. BoxPricingCheck does not have EBS functionality
        case (/Requests-Tier1/.test(UsageType)):
            var pricingQuery = {
                TierName: "putcopypost"
            };
            return pricingQuery;
            break;
        case (/Requests-Tier2/.test(UsageType)):
            var pricingQuery = {
                TierName: "getEtc"
            };
            return pricingQuery;
            break;
        case (/EBS:VolumeUsage.gp2/.test(UsageType)):
            var pricingQuery = {
                TypeName: "Amazon EBS General Purpose (SSD) volumes"
            };
            return pricingQuery;
            break;
        case (/TimedStorage-ByteHrs/.test(UsageType)):
            var pricingQuery = {
                TierName: "firstTBstorage"
            };
            return pricingQuery;
            break;
        case (/RDS:GP2-Storage/.test(UsageType)):
            var pricingQuery = {
                TierName: "db.m1.small"
            };
            return pricingQuery;
            break;
        case (/BoxUsage:t2.micro/.test(UsageType)):
            if (/Windows/.test(ItemDescription)) {
                var pricingQuery = {
                    InstanceSize: "t2.micro",
                    OS: "mswin"
                };
                return pricingQuery;
            } else if (/SUSE/.test(ItemDescription)) {
                var pricingQuery = {
                    InstanceSize: "t2.micro",
                    OS: "sles"
                };
                return pricingQuery;
            } else if (/Linux/.test(ItemDescription)) {
                var pricingQuery = {
                    InstanceSize: "t2.micro",
                    OS: "linux"
                };
                return pricingQuery;
            } else if (/RHEL/.test(ItemDescription)) {
                var pricingQuery = {
                    InstanceSize: "t2.micro",
                    OS: "rhel"
                };
                return pricingQuery;
            }
            break;
        default:
            console.log("Error: UsageType not in record");
    }
}

exports.CheckFreeTier = function(req, res) {
    // var db = mongoose.connection
    mongoose.model('Billings').aggregate({
        $match: {
            ItemDescription: {$regex: /free tier/}
        }
    }, {
        $group: {
            _id: "$RateId",
            ItemDescription: {$addToSet: "$ItemDescription"},
            UsageType: {$addToSet: "$UsageType"}
        }
    }).exec(function(e, d) {
        if (e) {
            console.error(e.message);
            console.error(e.stack);
        }
        for (var r in d) {
            var UsageType = d[r].UsageType[0];
            var ItemDescription = d[r].ItemDescription[0];

            switch (true) {
                // //value == .09
                case (/DataTransfer-Out-Bytes/.test(UsageType)):
                    //console.log("matched /DataTransfer-Out-Bytes/");
                    var pricingQuery = {
                        TierName: 'upTo10TBout'
                    };
                    var billingQuery = {
                        UsageType: {$regex: /DataTransfer-Out-Bytes/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);

                    break;

                    //     //value.price should == .02
                case (/DataTransfer-Regional-Bytes/.test(UsageType)):
                    //console.log("matched /DataTransfer-Regional-Bytes/");


                    var pricingQuery = {
                        TierName: "crossRegion",
                        TypeName: "dataXferOutEC2"
                    };
                    var billingQuery = {
                        UsageType: {$regex: /DataTransfer-Regional-Bytes/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;
                    //     //value.price should == 0.02 
                    //     //http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js
                case (/AWS-Out-Bytes/.test(UsageType)):
                    //console.log("matched /AWS-Out-Bytes/");
                    var pricingQuery = {
                        TierName: "crossRegion",
                        TypeName: "dataXferOutEC2"
                    };
                    var billingQuery = {
                        UsageType: {$regex: 'AWS-Out-Bytes'},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery, function(){
                        console.log("Updated AWS-Out-Bytes values");
                    });
                    break;

                    //value.price should == 0.017

                case (/InstanceUsage:db.t2.micro/.test(UsageType)): //InstanceUsage is for RDS
                    //console.log("matched /InstanceUsage:db.t2.micro/");

                    var pricingQuery = {
                        TierName: "db.t2.micro"
                    };
                    var billingQuery = {
                        UsageType: {$regex: /InstanceUsage:db.t2.micro/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //Mongo Queries have been completed up to this point. BoxPricingCheck does not have EBS functionality
                    //     //value.price should == .005
                case (/Requests-Tier1/.test(UsageType)):
                    //console.log("matched /Request-Tier1/");

                    var pricingQuery = {
                        TierName: "putcopypost"
                    };
                    var billingQuery = {
                        UsageType: {$regex: /Requests-Tier1/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //value.price should == 0.004
                case (/Requests-Tier2/.test(UsageType)):
                    //console.log("matched /Request-Tier2/");
                    var pricingQuery = {
                        TierName: "getEtc"
                    };
                    var billingQuery = {
                        UsageType: {$regex: /Requests-Tier2/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //value.price should == .1
                case (/EBS:VolumeUsage.gp2/.test(UsageType)):
                    //console.log("matched /EBS:VolumeUsage.gp2/");

                    var pricingQuery = {
                        TypeName: "Amazon EBS General Purpose (SSD) volumes"
                    };
                    var billingQuery = {
                        UsageType: { $regex: /EBS:VolumeUsage.gp2/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     //value.price should == 0.03
                case (/TimedStorage-ByteHrs/.test(UsageType)):
                    //console.log("matched /EBS:VolumeUsage.gp2/");

                    var pricingQuery = {
                        TierName: "firstTBstorage"
                    };
                    var billingQuery = {
                        UsageType: {$regex: /TimedStorage-ByteHrs/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                    //     ////value.price should == .115
                case (/RDS:GP2-Storage/.test(UsageType)):
                    //console.log("matched /EBS:VolumeUsage.gp2/");

                    var pricingQuery = {
                        TierName: "db.m1.small"
                    };
                    var billingQuery = {
                        UsageType: {$regex: /RDS:GP2-Storage/},
                        ItemDescription: {$regex: /free tier/}
                    };
                    updateBillingValues(pricingQuery, billingQuery);
                    break;

                case (/BoxUsage:t2.micro/.test(UsageType)): //BoxUsage is for EC2
                    //console.log("matched /BoxUsage:t2.micro/");
                    if (/Windows/.test(ItemDescription)) {
                        //console.log("matched /Windows/");
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "mswin"
                        };
                        var billingQuery = {
                            UsageType: {$regex: /t2.micro/},
                            ItemDescription: {$regex: /Windows t2.micro/}
                        };
                        updateBillingValues(pricingQuery, billingQuery);

                    } else if (/SUSE/.test(ItemDescription)) {
                        //console.log("matched /SUSE/")
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "sles"
                        };
                        var billingQuery = {
                            UsageType: {$regex: /t2.micro/},
                            ItemDescription: {$regex: /per SUSE Linux t2.micro/}
                        };
                        updateBillingValues(pricingQuery, billingQuery);

                    } else if (/Linux/.test(ItemDescription)) {
                        //console.log("matched /Linux/")
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "linux"
                        };
                        var billingQuery = {UsageType: {$regex: /t2.micro/},
                            ItemDescription: {$regex: /per Linux t2.micro/}
                        };
                        updateBillingValues(pricingQuery, billingQuery);
                        break;
                    } else if (/RHEL/.test(ItemDescription)) {
                        //console.log("matched /RHEL/")
                        var pricingQuery = {
                            InstanceSize: "t2.micro",
                            OS: "rhel"
                        };
                        var billingQuery = {
                            UsageType: {$regex: /t2.micro/},
                            ItemDescription: {$regex: / RHEL t2.micro/}
                        };
                        updateBillingValues(pricingQuery, billingQuery);
                        break;
                    }
            }
        }
         // res.send("Done updating free tier rates");
    });
}