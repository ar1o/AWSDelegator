var MongoClient = require('mongodb').MongoClient;
var AWS = require('aws-sdk');
var regionIteratorIndex, newInstanceCount;
var awsRegions = ['us-west-1', 'us-west-2', 'us-east-1'];
var instanceVolumes = {};
var userInstances;
// var activeInstances;

exports.parseInstances = function(_callback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        //make sure 'instance' collection is present
        instanceVolumes = {};
        db.collections(function(err, collections) {
            var re = /instances/g;
            var collectionExists = false;
            for (var i in collections)
                if (re.exec(collections[i]['namespace'])) collectionExists = true;
            if (!collectionExists) {
                db.createCollection("instances", function(err, collection) {
                    if (err) throw err;
                    console.log("Database Alert: 'instances' collection created");
                });
            }
            //get all user instances
            mongoose.model('Instances').find().exec(function(err, result) {
                if (err) throw err;
                // activeInstances = [];
                userInstances = result;
                regionIteratorIndex = 0;
                newInstanceCount = 0;
                var terminatedInstancesCount = 0;
                var controller = function() {
                    iterator(function() {
                        regionIteratorIndex++;
                        if (regionIteratorIndex < awsRegions.length) {
                            controller();
                        } else {
                            console.log("Parse Alert: found ",newInstanceCount," new instance/s");
                            // for(var i in userInstances){
                            //     console.log(activeInstances.indexOf(userInstances[i].Id));
                            //     if(activeInstances.indexOf(userInstances[i].Id)==-1){
                            //         console.log("here");
                            //         mongoose.model('Instances').update({
                            //             Id: userInstances[i].Id,
                            //         }, {
                            //             $set: {
                            //                 State: "terminated"
                            //             }
                            //         });
                            //         terminatedInstancesCount += 1;
                            //     }
                            // }
                            if(terminatedInstancesCount!=0)
                                console.log("Parse Alert: found ",terminatedInstancesCount," terminated instance/s");
                            _callback();
                        }
                    });
                }
                var iterator = function(callback) {
                    console.log('Parse Alert: parsing instances in ', awsRegions[regionIteratorIndex]);
                    var ec2 = new AWS.EC2({
                        region: awsRegions[regionIteratorIndex]
                    });
                    ec2.describeInstances({}, function(err, data) {
                        if (err) throw err;
                        for (var r in data.Reservations) {
                            //get volumeId's
                            var volumeId = [];
                            // activeInstances.push(data.Reservations[r].Instances[0].InstanceId);
                            for(var i=0 in data.Reservations[r].Instances[0].BlockDeviceMappings){
                                volumeId.push(data.Reservations[r].Instances[0].BlockDeviceMappings[i].Ebs['VolumeId'])
                            }
                            instanceVolumes[data.Reservations[r].Instances[0].InstanceId]=volumeId;
                            //get emailId from tag
                            var emailId = "mikesmit.com@gmail.com";
                            for (var t in data.Reservations[r].Instances[0].Tags) {
                                if (data.Reservations[r].Instances[0].Tags[t].Key == 'email') {
                                    EmailId = data.Reservations[r].Instances[0].Tags[t].Value;
                                }
                            }
                            var currentTimeMilliseconds = (new Date).getTime();
                            var currentTimeIso = new Date(currentTimeMilliseconds).toISOString();
                            var launchTimeDate = new Date(data.Reservations[r].Instances[0].LaunchTime);
                            var launchTimeMilliseconds = launchTimeDate.getTime();
                            var newInstance = true;
                            if(isNewInstance(data.Reservations[r].Instances[0].InstanceId)){
                                var lifetime = parseInt((currentTimeMilliseconds - launchTimeMilliseconds)/(60*1000));
                                var doc = {
                                    Id: data.Reservations[r].Instances[0].InstanceId,
                                    State: data.Reservations[r].Instances[0].State['Name'],
                                    ImageId: data.Reservations[r].Instances[0].ImageId,
                                    KeyName: data.Reservations[r].Instances[0].KeyName,
                                    Type: data.Reservations[r].Instances[0].InstanceType,
                                    LaunchTime: data.Reservations[r].Instances[0].LaunchTime,
                                    Zone: data.Reservations[r].Instances[0].Placement['AvailabilityZone'],
                                    Lifetime: lifetime,
                                    VolumeId: volumeId,
                                    Email: emailId,
                                    LastActiveTime: currentTimeIso
                                };
                                newInstanceCount += 1;
                                db.collection('instances').insert(doc);
                            }else{
                                var objectId,j;
                                for(var i=0 in userInstances){
                                    if(userInstances[i].Id == data.Reservations[r].Instances[0].InstanceId){
                                        objectId = userInstances[i]._id;
                                        j=i;
                                        break;
                                    }
                                }
                                var stateDB = userInstances[j].State;
                                var instanceId = userInstances[j].Id;
                                var stateDS = data.Reservations[r].Instances[0].State['Name'];
                                var lastActiveTimeDate = new Date(userInstances[j].LastActiveTime);
                                var lastActiveTimeMilliseconds = lastActiveTimeDate.getTime();
                                var lifetime = userInstances[j].Lifetime;
                                lifetime += parseInt((currentTimeMilliseconds - lastActiveTimeMilliseconds)/(60*1000));
                                if (stateDB == "running" && stateDS == "running") {
                                    db.collection('instances').update({
                                        _id: objectId
                                    }, {
                                        $set: {
                                            Lifetime: lifetime,
                                            LastActiveTime: currentTimeIso,
                                            VolumeId: instanceVolumes[instanceId]
                                        }
                                    },function(err,res){
                                        if(err) throw err;
                                    });
                                } else if (stateDB == "running" && (stateDS == "stopped" || stateDS == "stopping")) {
                                    db.collection('instances').update({
                                        _id: objectId
                                    }, {
                                        $set: {
                                            Lifetime: lifetime,
                                            LastActiveTime: currentTimeIso,
                                            State: "running",
                                            VolumeId: instanceVolumes[instanceId]
                                        }
                                    });
                                } else if ((stateDB == "stopped" || stateDB == "stopping") && stateDS == "running") {
                                    db.collection('instances').update({
                                        _id: objectId
                                    }, {
                                        $set: {
                                            State: "running",
                                            VolumeId: instanceVolumes[instanceId]
                                        }
                                    });
                                }else if(stateDB != "terminated" && stateDS == "terminated"){
                                    db.collection('instances').update({
                                        _id: objectId
                                    }, {
                                        $set: {
                                            State: "terminated"
                                        }
                                    });
                                    terminatedInstancesCount += 1;
                                }
                            }            
                        }
                        callback();
                    });
                }
                controller();
            });
        });
    });
}

var isNewInstance = function(instanceId) {
    for (var i in userInstances) {
        if (userInstances[i].Id == instanceId) {
            return false;
        }
    }
    return true;
}