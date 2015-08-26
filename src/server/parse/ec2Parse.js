//update ec2Instances - add/remove instances & instance state changes
exports.parseInstances = function(callback) {
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
                        if(newInstanceCount!=0)
                            console.log("ParseAlert(ec2): found ",newInstanceCount," new instance/s");
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
                        callback();
                    }
                });
            }
            var iterator1 = function(callback) {
                var ec2 = new AWS.EC2({
                    region: awsRegions[regionIteratorIndex]
                });
                ec2.describeInstances({}, function(err, data) {
                    if (err) throw err;
                    for (var r in data.Reservations) {
                        
                        var volumeId = [];
                        activeInstances.push(data.Reservations[r].Instances[0].InstanceId);
                        for(var i=0 in data.Reservations[r].Instances[0].BlockDeviceMappings){
                            volumeId.push(data.Reservations[r].Instances[0].BlockDeviceMappings[i].Ebs['VolumeId'])
                        }
                        instanceVolumes[data.Reservations[r].Instances[0].InstanceId]=volumeId;
                        var userName = 'null';
                        for (var t in data.Reservations[r].Instances[0].Tags) {
                            if (data.Reservations[r].Instances[0].Tags[t].Key == 'Name') {
                                userName = data.Reservations[r].Instances[0].Tags[t].Value;
                            }
                        }
                        if(userName == ""){
                            userName = 'null';
                        }
                        var groupName = 'null';
                        for (var t in data.Reservations[r].Instances[0].Tags) {
                            if (data.Reservations[r].Instances[0].Tags[t].Key == 'Group') {
                                groupName = data.Reservations[r].Instances[0].Tags[t].Value;
                            }
                        }
                        if(groupName == ""){
                            groupName = 'null';
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
                                Name: userName,
                                Group: groupName,
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
                                        State: "stopped",
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

//Hourly metric parse for ec2Instances
exports.parseMetrics = function(caller,masterCallback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        mongoose.model('ec2Instances').find({
            State: 'running',
        }).exec(function(err, runningInstances) {
            index1 = 0;
            var currentDate = new Date();
            var currentTime = currentDate.getTime();
            var currentTimeIso = new Date(currentTime).toISOString();           
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
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
                var instanceMetrics = {};
                var index2 = 0;
                var controller2 = function(){
                    iterator2(function(){
                        index2++;
                        if(index2 < ec2Metric.length) controller2();
                        else{          
                            for(var i in instanceMetrics){
                                //time format: Thu Jun 25 2015 05:25:00 GMT-0300 (ADT) 
                                var date = i.split(' ');
                                var mm1 = String(months.indexOf(date[1])), dd = date[2], yyyy = date[3];
                                var time = date[4].split(':');
                                var hh = time[0], mm2 = time[1], ss = time[2];
                                var _time = new Date(yyyy,mm1,dd,hh,mm2,ss,0000);
                                var utcTime = _time.getTime();
                                var doc = {
                                    InstanceId: runningInstances[index1].Id,
                                    NetworkIn: instanceMetrics[i].NetworkIn,
                                    NetworkOut: instanceMetrics[i].NetworkOut,
                                    CPUUtilization: instanceMetrics[i].CPUUtilization,
                                    Time: utcTime
                                };
                                db.collection('ec2Metrics').insert(doc);
                            }
                            callback();
                        }
                    });
                };
                var iterator2 = function(_callback){
                    params.Dimensions[0].Value = runningInstances[index1].Id;
                    if(caller=='scheduler'){
                        params.StartTime = new Date(currentTime-1000*3600).toISOString();
                        params.EndTime = currentTimeIso;      
                    }else if(caller=='setup'){
                        params.StartTime = new Date(currentTime-1000*3600*24*14).toISOString();
                        params.EndTime = new Date(currentTime-1000*3600).toISOString();  
                    }
                    params.MetricName = ec2Metric[index2];
                    params.Unit = ec2MetricUnit[index2];
                    cloudwatch.getMetricStatistics(params, function(err, data) {
                        if(err) throw err;
                        for(var i in data.Datapoints){
                            if(!(data.Datapoints[i].Timestamp in instanceMetrics))
                                instanceMetrics[data.Datapoints[i].Timestamp]={};
                            instanceMetrics[data.Datapoints[i].Timestamp][ec2Metric[index2]]=data.Datapoints[i].Average;
                        }
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