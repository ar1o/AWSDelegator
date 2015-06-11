var MongoClient = require('mongodb').MongoClient;
var databaseUrl = 'mongodb://localhost:27017/awsdb';

exports.parseInstances = function(masterCallback, res) {
    var ec2 = new AWS.EC2({
        region: "us-west-2"
    });
    // GET information on EC2 instances. Returns JSON.
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        db.collections(function(err, collections) {
            var re = /instances/g;
            var collectionExists = false;
            for (var i in collections)
                if (re.exec(collections[i]['namespace'])) collectionExists = true;
            if (!collectionExists) {
                db.createCollection("instances", function(err, collection) {
                    if (err) throw err;
                    console.log("Created collection - instances");
                });
            }
        });
        mongoose.model('Instances').aggregate([{
            $project: { 
                _id: 0, 
                Id: 1
            }
        }]).exec(function(err, userInstances) {
            if (err) throw err;
            // console.log(userInstances);
            ec2.describeInstances({}, function(err, data) {
                if (err) throw err;
                var newInstanceCount = 0; 
                for (var r in data.Reservations) {
                    var volumeId_exists = false;
                    var volumeId = "";
                    var EmailId = "mikesmit.com@gmail.com";
                    for (var t in data.Reservations[r].Instances[0].Tags){
                        if (data.Reservations[r].Instances[0].Tags[t].Key == 'Volume Id'){ 
                            volumeId_exists = true;
                            volumeId = data.Reservations[r].Instances[0].Tags[t].Value;                            
                        }
                        else if (data.Reservations[r].Instances[0].Tags[t].Key == 'email'){
                            EmailId = data.Reservations[r].Instances[0].Tags[t].Value;
                        }
                    }
                    if(volumeId_exists){
                        var currentTimeMilliseconds = (new Date).getTime();
                        var currentTimeIso = new Date(currentTimeMilliseconds).toISOString();                        
                        var launchTimeDate = new Date(data.Reservations[r].Instances[0].LaunchTime);
                        var launchTimeMilliseconds = launchTimeDate.getTime();
                        var newInstance = true;         

                        for(var i in userInstances){
                            if(userInstances[i].Id==data.Reservations[r].Instances[0].InstanceId){
                                newInstance=false;
                            }
                        }
                        if(newInstance){
                            var doc = {
                                Id: data.Reservations[r].Instances[0].InstanceId,
                                State: data.Reservations[r].Instances[0].State['Name'],
                                ImageId: data.Reservations[r].Instances[0].ImageId,
                                KeyName: data.Reservations[r].Instances[0].KeyName,
                                Type: data.Reservations[r].Instances[0].InstanceType,
                                LaunchTime: data.Reservations[r].Instances[0].LaunchTime,
                                Zone: data.Reservations[r].Instances[0].Placement['AvailabilityZone'],
                                Lifetime: currentTimeMilliseconds - launchTimeMilliseconds,
                                VolumeId: volumeId,
                                Email: EmailId,
                                LastActiveTime: currentTimeIso
                            }; 
                            newInstanceCount+=1;
                            db.collection('instances').insert(doc);
                        }else{
                            mongoose.model('Instances').find({
                                Id: data.Reservations[r].Instances[0].InstanceId
                            }).exec(function(err, result) {
                                // console.log(result);
                                var stateDB = result[0].State;
                                var stateDS = data.Reservations[r].Instances[0].State['Name'];
                                var LastActiveTimeDate = new Date(result[0].LastActiveTime);
                                var LastActiveTimeMilliseconds = LastActiveTimeDate.getTime();
                                var Lifetime = result[0].Lifetime;
                                if(stateDB == "running" && stateDS == "running"){                                    
                                    db.collection('instances').update({
                                        Id: data.Reservations[r].Instances[0].InstanceId,                                        
                                        },{ 
                                        $set: {
                                            Lifetime: Lifetime + currentTimeMilliseconds - LastActiveTimeMilliseconds,
                                            LastActiveTime: currentTimeIso
                                        }
                                    });
                                    // console.log("updated instance document");
                                }else if(stateDB == "running" && (stateDS == "stopped" || stateDS == "stopping")){
                                    db.collection('instances').update({
                                        Id: data.Reservations[r].Instances[0].InstanceId,                                        
                                    },{
                                    $set: {
                                            Lifetime: Lifetime + currentTimeMilliseconds - LastActiveTimeMilliseconds,
                                            LastActiveTime: currentTimeIso,
                                            State: "running"
                                        }                                        
                                    });
                                    // console.log("updated instance document");
                                }else if((stateDB == "stopped" || stateDB == "stopping") && stateDS == "running"){
                                    db.collection('instances').update({
                                        Id: data.Reservations[r].Instances[0].InstanceId,                                        
                                    },{ 
                                    $set: {
                                            State: "running"
                                        }
                                    });
                                    // console.log("updated instance document");
                                }
                            });
                        }
                    }else{
                        if(data.Reservations[r].Instances[0].State['Name'] != 'terminated') {
                            var rInstance = data.Reservations[r].Instances[0];                            
                            var instanceId = rInstance.InstanceId;
                            var volumeId = rInstance.BlockDeviceMappings[0].Ebs.VolumeId;
                            var params_vol = {
                                Resources: [
                                    instanceId,
                                ],
                                Tags: [{
                                    Key: 'Volume Id',
                                    Value: volumeId
                                }, ]
                            };
                            ec2.createTags(params_vol, function(err) {
                                if (err) throw err;
                            });
                        }
                    }
                }
                console.log("Database Update: "+newInstanceCount+" instance/s added");                
                masterCallback();
            });
        })
    });
};