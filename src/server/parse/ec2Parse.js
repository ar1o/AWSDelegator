exports.parseInstances = function(callback) {
    console.log("Parse Alert(ec2): Instance parsing initiated");
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        var instanceVolumes = {};
        mongoose.model('ec2Instances').find().exec(function(err, userInstances) {
            if (err) throw err;
            var activeInstances = [];
            var regionIteratorIndex = 0;    
            var newInstanceCount = 0;
            var terminatedInstancesCount = 0;
            var index1 = 0;
            var controller1 = function() {
                iterator1(function() {
                    regionIteratorIndex++;
                    if (regionIteratorIndex < awsRegions.length) {
                        controller1();
                    } else {
                        console.log("Parse Alert(ec2): found ",newInstanceCount," new instance/s");
                        for(var i in userInstances){
                            if(activeInstances.indexOf(userInstances[i].Id)==-1){
                                mongoose.model('ec2Instances').update({
                                    Id: userInstances[i].Id,
                                }, {
                                    $set: {
                                        State: "terminated"
                                    }
                                });
                                terminatedInstancesCount += 1;
                            }
                        }
                        if(terminatedInstancesCount!=0)
                            console.log("Parse Alert(ec2): found ",terminatedInstancesCount," terminated instance/s");
                        callback();
                    }
                });
            }
            var iterator1 = function(callback) {
                console.log('Parse Alert(ec2): parsing instances in ', awsRegions[regionIteratorIndex]);
                var ec2 = new AWS.EC2({
                    region: awsRegions[regionIteratorIndex]
                });
                ec2.describeInstances({}, function(err, data) {
                    if (err) throw err;
                    for (var r in data.Reservations) {
                        //get volumeId's
                        var volumeId = [];
                        activeInstances.push(data.Reservations[r].Instances[0].InstanceId);
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
                        if(isNewInstance(userInstances, data.Reservations[r].Instances[0].InstanceId)){
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
                            db.collection('ec2Instances').insert(doc);
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
                                db.collection('ec2Instances').update({
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
                                db.collection('ec2Instances').update({
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
                                db.collection('ec2Instances').update({
                                    _id: objectId
                                }, {
                                    $set: {
                                        State: "running",
                                        VolumeId: instanceVolumes[instanceId]
                                    }
                                });
                            }else if(stateDB != "terminated" && stateDS == "terminated"){
                                db.collection('ec2Instances').update({
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
            controller1();
        });
    });
}

exports.parseMetrics = function(masterCallback) {
    console.log("Parse Alert(ec2): Metrics parsing initiated");
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        mongoose.model('ec2Instances').find({
            State: 'running',
        }).exec(function(err, runningInstances) {
            index1 = 0;
            var currentDate = new Date();
            var currentTime = currentDate.getTime();
            var currentTimeIso = new Date(currentTime).toISOString();           

            var params = {
                EndTime: 0,
                MetricName: '',
                Namespace: 'AWS/EC2',
                Period: 3600,
                StartTime: 0,
                Statistics: ['Average'],
                Dimensions: [{
                    Name: 'InstanceId',
                    Value: ''
                }, ],
                Unit: ''
            };
            var controller1 = function(arr) {
                iterator1(arr[index1], function() {
                    index1++;
                    if (index1 < arr.length) controller1(arr);
                    else{
                        masterCallback();
                    }
                });
            };
            var iterator1 = function(instance, callback) {
                var instanceRegion = runningInstances[index1].Zone;
                AWS.config.region = instanceRegion.substring(0,instanceRegion.length-1);
                var cloudwatch = new AWS.CloudWatch();
                var doc = {
                    InstanceId: runningInstances[index1].Id,
                    NetworkIn: 0,
                    NetworkOut: 0,
                    CPUUtilization: 0,
                    Time: currentTimeIso
                };
                var index2 = 0;
                var controller2 = function(){
                    iterator2(function(){
                        index2++;
                        if(index2 < ec2Metric.length) controller2();
                        else{
                            db.collection('ec2Metrics').insert(doc);
                            callback();
                        }
                    });
                };
                var iterator2 = function(_callback){
                    params.Dimensions[0].Value = doc.InstanceId;
                    params.StartTime = new Date(currentTime-3600*1000).toISOString();
                    params.EndTime = currentTimeIso;                
                    params.MetricName = ec2Metric[index2];
                    params.Unit = ec2MetricUnit[index2];
                    cloudwatch.getMetricStatistics(params, function(err, data) {
                        if(err) throw err;
                        doc[ec2Metric[index2]] = data.Datapoints[0].Average;
                        _callback();
                    });  
                };
                controller2();
            };   
            if (runningInstances.length != 0) {
                controller1(runningInstances);
            } else {
                masterCallback();
            }
        });
    });
}

var isNewInstance = function(userInstances, instanceId) {
    for (var i in userInstances) {
        if (userInstances[i].Id == instanceId) {
            return false;
        }
    }
    return true;
}