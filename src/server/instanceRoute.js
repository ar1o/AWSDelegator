
module.exports = function(req, res){
    var ec2 = new AWS.EC2({
        region: "us-west-2"
    });

    // GET information on EC2 instances. Returns JSON.
    ec2.describeInstances({}, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        for (var r in data.Reservations) {
            for (var i in data.Reservations[r].Instances) {
                for (var t in data.Reservations[r].Instances[i].Tags) {
                    // if (data.Reservations[r].Instances[i].Tags[t].Key == "Volume Id") {
                    // if (data.Reservations[r].Instances[i].Tags[t].Value == "") {
                    // console.log(data.Reservations[r].Instances[i].Tags[t]);
                    var rInstance = data.Reservations[r].Instances[i];
                    var instanceId = rInstance.InstanceId;
                    var volumeId = rInstance.BlockDeviceMappings[0].Ebs.VolumeId;
                    // console.log(instanceId);
                    // console.log(volumeId);

                    var params_vol = {
                        Resources: [ /* required */
                            instanceId,
                            /* more items */
                        ],
                        Tags: [ /* required */ {
                                Key: 'Volume Id',
                                Value: volumeId
                            },
                            /* more items */
                        ]
                    };
                    ec2.createTags(params_vol, function(err) {
                        if (err) console.log(err, err.stack); // an error occurred
                        // else console.log(data); // successful response
                    });
                    // }
                    // }
                }
            }
        }
        res.send(data);
    });
};
