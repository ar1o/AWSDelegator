
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
        console.log("instanceRoute-->data");        
        for (var r in data.Reservations) {
            for (var i in data.Reservations[r].Instances) {
                var volumeId_exists = false;                
                for (var t in data.Reservations[r].Instances[i].Tags) 
                    if (data.Reservations[r].Instances[i].Tags[t].Key == "Volume Id") volumeId_exists=true;
                if(!volumeId_exists && data.Reservations[r].Instances[i].State['Name']!='terminated'){                    
                    var rInstance = data.Reservations[r].Instances[i];
                    console.log(rInstance);
                    var instanceId = rInstance.InstanceId;
                    var volumeId = rInstance.BlockDeviceMappings[0].Ebs.VolumeId;
                    var params_vol = {
                        Resources: [ 
                            instanceId,                            
                        ],
                        Tags: [ 
                            {
                                Key: 'Volume Id',
                                Value: volumeId
                            },                            
                        ]
                    };
                    ec2.createTags(params_vol, function(err) {
                        if (err) console.log(err, err.stack); // an error occurred
                        // else console.log(data); // successful response
                    });
                }
            }
        }
        res.send(data);
    });
};
