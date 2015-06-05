//Query and update FREE TIER billing and update associated cost rates
exports.freeTier = function(req, res) {
    mongoose.model('Billings').aggregate({
        $match: {
            ItemDescription: {
                $regex: /(free tier)/
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
                case (/DataTransfer-Out-Bytes/.test(UsageType)):
                    console.log("matched /DataTransfer-Out-Bytes/");
                    conditions = {
                        UsageType: { $regex: /DataTransfer-Out-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.39 };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;

                case (/DataTransfer-Regional-Bytes/.test(UsageType)):
                    console.log("matched /DataTransfer-Regional-Bytes/");
                    conditions = {
                        UsageType: { $regex: /DataTransfer-Regional-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.02 };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;

                case (/AWS-Out-Bytes/.test(UsageType)):
                    console.log("matched /AWS-Out-Bytes/");
                    conditions = {
                        UsageType: { $regex: /AWS-Out-Bytes/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.02 };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;

                case (/InstanceUsage:db.t2.micro/.test(UsageType)): //InstanceUsage is for RDS
                    console.log("matched /InstanceUsage:db.t2.micro/");
                    conditions = {
                        UsageType: { $regex: /InstanceUsage:db.t2.micro/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.017 };
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;

                case (/BoxUsage:t2.micro/.test(UsageType)): //BoxUsage is for EC2
                    console.log("matched /BoxUsage:t2.micro/");
                    conditions = {
                        UsageType: { $regex: /BoxUsage:t2.micro/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    options = { multi: true };

                    if (/Windows/.test(ItemDescription)) {
                        console.log("matched /Windows/")
                        update = { Rate: 0.018 };
                    } else if (/SUSE/.test(ItemDescription)) {
                        console.log("matched /SUSE/")
                        update = { Rate: 0.023 };
                    } else if (/Linux/.test(ItemDescription)) {
                        console.log("matched /Linux/")
                        update = { Rate: 0.013 };
                    } else if (/RHEL/.test(ItemDescription)) {
                        console.log("matched /RHEL/")
                        update = { Rate: 0.073 };
                    }
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                
                case (/Requests-Tier1/.test(UsageType)): 
                    console.log("matched /Request-Tier1/");
                    conditions = {
                        UsageType: { $regex: /Requests-Tier1/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.005 };//(UsageQuantity/1000)0.005
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                case (/Requests-Tier2/.test(UsageType)):
                    console.log("matched /Request-Tier2/");
                    conditions = {
                        UsageType: { $regex: /Requests-Tier2/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.004 };//(UsageQuantity/10000)0.004
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                case (/EBS:VolumeUsage.gp2/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /EBS:VolumeUsage.gp2/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.1 }; //per GB-month
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                case (/TimedStorage-ByteHrs/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /TimedStorage-ByteHrs/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.03 }; //First 1 TB / month, first 5gb is FREE.
                    options = { multi: true };
                    mongoose.model('Billings').update(conditions, update, options, callback);

                    function callback(err, numAffected) {
                        console.log(numAffected)
                    };
                    break;
                case (/RDS:GP2-Storage/.test(UsageType)):
                    console.log("matched /EBS:VolumeUsage.gp2/");
                    conditions = {
                        UsageType: { $regex: /RDS:GP2-Storage/ },
                        ItemDescription: { $regex: /free tier/ }
                    };
                    update = { Rate: 0.115 }; 
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