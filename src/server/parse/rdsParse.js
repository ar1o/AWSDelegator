exports.parseInstances = function(callback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        db.collections(function(err, collections) {
            mongoose.model('rdsInstances').find().exec(function(err, userInstances) {
                if (err) throw err;
                var regionIteratorIndex = 0;
                var newInstanceCount = 0;
                var controller1 = function() {
                    iterator1(function() {
                        regionIteratorIndex++;
                        if (regionIteratorIndex < awsRegions.length) {
                            controller1();
                        } else {
                            console.log("ParseAlert(rds): found ",newInstanceCount," new instance/s");
                            callback();
                        }
                    });
                }
                var iterator1 = function(callback) {
                    // console.log('ParseAlert(rds): parsing instances in ', awsRegions[regionIteratorIndex]);
                    var rds = new AWS.RDS({
                        region: awsRegions[regionIteratorIndex]
                    });
                    rds.describeDBInstances({}, function(err, data) {
                        if (err) throw err;
                        for (var r in data.DBInstances) {
       
                            var newInstance = true;
                            if(isNewInstance(userInstances, data.DBInstances[r].DBInstanceIdentifier)){
                                var doc = {
                                    DBInstanceIdentifier: data.DBInstances[r].DBInstanceIdentifier,
                                    DBInstanceClass: data.DBInstances[r].DBInstanceClass,
                                    Engine: data.DBInstances[r].Engine,
                                    DBInstanceStatus: data.DBInstances[r].DBInstanceStatus,
                                    MasterUsername: data.DBInstances[r].MasterUsername,
                                    DBName: data.DBInstances[r].DBName,
                                    Endpoint: data.DBInstances[r].Endpoint.Address+":"+data.DBInstances[r].Endpoint.Port,
                                    AllocatedStorage: data.DBInstances[r].AllocatedStorage,
                                    InstanceCreateTime: data.DBInstances[r].InstanceCreateTime,
                                    AvailabilityZone: data.DBInstances[r].AvailabilityZone,
                                    MultiAZ: data.DBInstances[r].MultiAZ,
                                    StorageType: data.DBInstances[r].StorageType
                                };
                                newInstanceCount += 1;
                                db.collection('rdsInstances').insert(doc);
                            }          
                        }
                        callback();
                    });
                }
                controller1();
            });
        });
    });
}

exports.parseMetrics = function(caller,masterCallback) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        mongoose.model('rdsInstances').find({
            DBInstanceStatus: 'available',
        }).exec(function(err, availableInstances) {
            index1 = 0;
            var currentDate = new Date();
            var currentTime = currentDate.getTime();
            var currentTimeIso = new Date(currentTime).toISOString(); 
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];          
            var params = {
                EndTime: 0,
                MetricName: '',
                Namespace: 'AWS/RDS',
                Period: 3600,
                StartTime: 0,
                Statistics: ['Average'],
                Dimensions: [{
                    Name: 'DBInstanceIdentifier',
                    Value: ''
                }, ],
                Unit: ''
            };
            var controller1 = function(arr) {
                iterator1(arr[index1], function() {
                    index1++;
                    if (index1 < arr.length) controller1(arr);
                    else{
                        db.close(); 
                        masterCallback();
                    }
                });
            }
            var iterator1 = function(instance, callback) {
                // console.log('ParseAlert(rds): parsing metrics of',availableInstances[index1].DBInstanceIdentifier);
                var instanceRegion = availableInstances[index1].AvailabilityZone;
                AWS.config.region = instanceRegion.substring(0,instanceRegion.length-1);
                var cloudwatch = new AWS.CloudWatch();
                var instanceMetrics = {};
                var index2 = 0;
                var controller2 = function(){
                    iterator2(function(){
                        index2++;
                        if(index2 < rdsMetric.length) controller2();
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
                                    DBInstanceIdentifier: availableInstances[index1].DBInstanceIdentifier,
                                    CPUUtilization: instanceMetrics[i].CPUUtilization,
                                    DatabaseConnections: instanceMetrics[i].DatabaseConnections,
                                    DiskQueueDepth: instanceMetrics[i].DiskQueueDepth,
                                    ReadIOPS: instanceMetrics[i].ReadIOPS,
                                    WriteIOPS: instanceMetrics[i].WriteIOPS,
                                    Time: utcTime
                                };
                                db.collection('rdsMetrics').insert(doc);
                            }
                            callback();
                        }
                    });
                };
                var iterator2 = function(_callback){
                    if(caller=='scheduler'){
                        params.StartTime = new Date(currentTime-1000*3600).toISOString();
                        params.EndTime = currentTimeIso;      
                    }else if(caller=='setup'){
                        params.StartTime = new Date(currentTime-1000*3600*24*14).toISOString();
                        params.EndTime = new Date(currentTime-1000*3600).toISOString();  
                    }
                    params.Dimensions[0].Value = availableInstances[index1].DBInstanceIdentifier;                
                    params.MetricName = rdsMetric[index2];
                    params.Unit = rdsMetricUnit[index2];
                    cloudwatch.getMetricStatistics(params, function(err, data) {
                        if(err) throw err;
                        for(var i in data.Datapoints){
                            if(!(data.Datapoints[i].Timestamp in instanceMetrics))
                                instanceMetrics[data.Datapoints[i].Timestamp]={};
                            instanceMetrics[data.Datapoints[i].Timestamp][rdsMetric[index2]]=data.Datapoints[i].Average;
                        }
                        _callback();
                    });  
                };
                controller2();
            }           
            if (availableInstances.length != 0) {
                controller1(availableInstances);
            } else {
                db.close();
                masterCallback();
            }
        });
    });
}

var isNewInstance = function(userInstances, instanceId) {
    for (var i in userInstances) {
        if (userInstances[i].DBInstanceIdentifier == instanceId) {
            return false;
        }
    }
    return true;
}