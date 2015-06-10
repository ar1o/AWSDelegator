//Query and update FREE TIER billing and update associated cost rates

//*Karl* -- Would it be better to instead do an upsert on each document to a new attribute?
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
        if(e){
            console.error(e.message);
            console.error(e.stack);
        }
        console.log(d);
        var conditions;
        var update;
        var options;
        for (var r in d) {
            console.log(d[r].UsageType[0] + "\t" + d[r].ItemDescription[0]);

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
                    var value = db.pricing.find({ProductName : "Data Transfer", TypeName : " datXferOutInternet"},{_id: 0, price : 1}).toArray()[0];
                    update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.price should == .02
                case (/DataTransfer-Regional-Bytes/.test(UsageType)):
                    console.log("matched /DataTransfer-Regional-Bytes/");
                    conditions = {
                        UsageType: { $regex: /DataTransfer-Regional-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    var value = db.pricing.find({ProductName : "Cross Region Data Transfer Out EC2"},{_id: 0, price : 1}).toArray()[0];
                    update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.price should == 0.02 
                //http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js
                case (/AWS-Out-Bytes/.test(UsageType)):
                    console.log("matched /AWS-Out-Bytes/");
                    conditions = {
                        UsageType: { $regex: /AWS-Out-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    //CURRENTLY INCORRECT
                    value = db.pricing.find({ProductName : "Cross Region Data Transfer Out EC2"},{_id: 0, price : 1}).toArray()[0];
                        update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.price should == 

                case (/InstanceUsage:db.t2.micro/.test(UsageType)): //InstanceUsage is for RDS
                    console.log("matched /InstanceUsage:db.t2.micro/");
                    conditions = {
                        UsageType: { $regex: /InstanceUsage:db.t2.micro/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    var value = db.pricing.find({tierName : "db.t2.micro"},{_id: 0, price : 1}).toArray()[0];
                    update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.price should == 
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
                        value = db.pricing.find({tierName : "t2.micro", OS : "mswin"},{_id: 0, price : 1}).toArray()[0]
                        update = { Rate: value.price };
                    } else if (/SUSE/.test(ItemDescription)) {
                        console.log("matched /SUSE/")
                        value = db.pricing.find({tierName : "t2.micro", OS : "sles"},{_id: 0, price : 1}).toArray()[0];
                        update = { Rate: value.price };
                    } else if (/Linux/.test(ItemDescription)) {
                        console.log("matched /Linux/")
                        value = db.pricing.find({tierName : "t2.micro", OS : "linux"},{_id: 0, price : 1}).toArray()[0];
                        update = { Rate: value.price };
                    } else if (/RHEL/.test(ItemDescription)) {
                        console.log("matched /RHEL/")
                        value = db.pricing.find({tierName : "t2.micro", OS : "rhel"},{_id: 0, price : 1}).toArray()[0];
                        update = { Rate: value.price };
                    }
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                //Mongo Queries have been completed up to this point. BoxPricingCheck does not have EBS functionality
                //value.price should == .005
                case (/Requests-Tier1/.test(UsageType)): 
                    console.log("matched /Request-Tier1/");
                    conditions = {
                        UsageType: { $regex: /Requests-Tier1/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "Requests Tier 1"},{_id: 0, price : 1}).toArray()[0];
                    update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.price should == 0.004
                case (/Requests-Tier2/.test(UsageType)):
                    console.log("matched /Request-Tier2/");
                    conditions = {
                        UsageType: { $regex: /Requests-Tier2/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "Requests Tier 2"},{_id: 0, price : 1}).toArray()[0];
                    update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.price should == .1
                case (/EBS:VolumeUsage.gp2/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /EBS:VolumeUsage.gp2/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "Amazon EBS General Purpose (SSD) volumes"},{_id: 0, price : 1}).toArray()[0];
                        update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //value.price should == 0.03
                case (/TimedStorage-ByteHrs/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /TimedStorage-ByteHrs/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({boxType : "firstTBstorage"},{_id: 0, price : 1}).toArray()[0];
                    update = { Rate: value.price };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                    //difficulty finding corresponding JSON
                    ////value.price should == .115
                case (/RDS:GP2-Storage/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /RDS:GP2-Storage/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    value = db.pricing.find({ProductName : "db.m1.small"},{_id: 0, price : 1}).toArray()[0];
                    update = { Rate: value.price };
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