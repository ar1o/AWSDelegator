//Query and update FREE TIER billing and update associated cost rates
exports.freeTier = function(req, res) {
    mongoose.model('Billings').aggregate({
        $match: {
            ItemDescription: {
                $regex: /free tier/
            }
            // Rate: {
            //     $eq: 0
            // }
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
        // console.log(d);
        var conditions;
        var update;
        var options;
        for (var r in d) {
            // console.log(d[r].UsageType[0] + "\t" + d[r].ItemDescription[0]);

            var UsageType = d[r].UsageType[0];
            var ItemDescription = d[r].ItemDescription[0];
            switch (true) {
                //value == .09
                case (/DataTransfer-Out-Bytes/.test(UsageType)):
                    console.log("matched /DataTransfer-Out-Bytes/");
                    conditions = {
                        UsageType: { $regex: /DataTransfer-Out-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    //value.prices should == 0.39
                    var value = db.pricing.find({ProductName : "DataTransfer-Out-Bytes"},{_id: 0, prices : 1}).toArray()[0];
                    update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.prices should == .02
                case (/DataTransfer-Regional-Bytes/.test(UsageType)):
                    console.log("matched /DataTransfer-Regional-Bytes/");
                    conditions = {
                        UsageType: { $regex: /DataTransfer-Regional-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    var value = db.pricing.find({ProductName : "DataTransfer-Regional-Bytes"},{_id: 0, prices : 1}).toArray()[0];
                    update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.prices should == 0.02 
                //http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js
                case (/AWS-Out-Bytes/.test(UsageType)):
                    console.log("matched /AWS-Out-Bytes/");
                    conditions = {
                        UsageType: { $regex: /AWS-Out-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({boxType : "crossRegion"},{_id: 0, prices : 1}).toArray()[0];
                        update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.prices should == 

                case (/InstanceUsage:db.t2.micro/.test(UsageType)): //InstanceUsage is for RDS
                    console.log("matched /InstanceUsage:db.t2.micro/");
                    conditions = {
                        UsageType: { $regex: /InstanceUsage:db.t2.micro/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    var value = db.pricing.find({boxType : "db.t2.micro"},{_id: 0, prices : 1}).toArray()[0];
                    update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.prices should == 
                case (/BoxUsage:t2.micro/.test(UsageType)): //BoxUsage is for EC2
                    console.log("matched /BoxUsage:t2.micro/");
                    conditions = {
                        UsageType: { $regex: /BoxUsage:t2.micro/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    options = { multi: true };
                    var value;
                    if (/Windows/.test(ItemDescription)) {
                        console.log("matched /Windows/")
                        value = db.pricing.find({boxType : "t2.micro", OS : "mswin"},{_id: 0, prices : 1}).toArray()[0]
                        update = { Rate: value.prices };
                    } else if (/SUSE/.test(ItemDescription)) {
                        console.log("matched /SUSE/")
                        value = db.pricing.find({boxType : "t2.micro", OS : "sles"},{_id: 0, prices : 1}).toArray()[0];
                        update = { Rate: value.prices };
                    } else if (/Linux/.test(ItemDescription)) {
                        console.log("matched /Linux/")
                        value = db.pricing.find({boxType : "t2.micro", OS : "linux"},{_id: 0, prices : 1}).toArray()[0];
                        update = { Rate: value.prices };
                    } else if (/RHEL/.test(ItemDescription)) {
                        console.log("matched /RHEL/")
                        value = db.pricing.find({boxType : "t2.micro", OS : "rhel"},{_id: 0, prices : 1}).toArray()[0];
                        update = { Rate: value.prices };
                    }
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                //Mongo Queries have been completed up to this point. BoxPricingCheck does not have EBS functionality
                //value.prices should == .005
                case (/Requests-Tier1/.test(UsageType)): 
                    console.log("matched /Request-Tier1/");
                    conditions = {
                        UsageType: { $regex: /Requests-Tier1/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "putcopypost"},{_id: 0, prices : 1}).toArray()[0];
                    update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.prices should == 0.004
                case (/Requests-Tier2/.test(UsageType)):
                    console.log("matched /Request-Tier2/");
                    conditions = {
                        UsageType: { $regex: /Requests-Tier2/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "getEtc"},{_id: 0, prices : 1}).toArray()[0];
                    update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.prices should == .1
                case (/EBS:VolumeUsage.gp2/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /EBS:VolumeUsage.gp2/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "Amazon EBS General Purpose (SSD) volumes"},{_id: 0, prices : 1}).toArray()[0];
                        update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.prices should == 0.03
                case (/TimedStorage-ByteHrs/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /TimedStorage-ByteHrs/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({boxType : "firstTBstorage"},{_id: 0, prices : 1}).toArray()[0];
                    update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //difficulty finding corresponding JSON
                    ////value.prices should == .115
                case (/RDS:GP2-Storage/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /RDS:GP2-Storage/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "db.m1.small"},{_id: 0, prices : 1}).toArray()[0];
                    update = { Rate: value.prices };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                default:
                    console.log("No match");
                    break;
            }

        }
        res.send("Done updating free tier rates");
    });
};