//checks budgets for time duration exceed
exports.checkBudgets = function() {
    var currentTime = new Date();
    //time format: '2015-07-22 23:50:20'
    var time = currentTime.getFullYear() + '-' + checkDate((currentTime.getMonth() + 1)) + '-' +
        checkDate(currentTime.getDate()) + ' ' + checkDate(currentTime.getHours()) + ':' +
        checkDate(currentTime.getMinutes()) + ':' + checkDate(currentTime.getSeconds());
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        mongoose.model('Budgets').find({}, function(e, budgets) {
            if (e) throw e;
            var index1 = 0;
            var controller1 = function() {
                iterator1(function() {
                    index1++;
                    if (index1 < budgets.length) controller1();
                });
            };
            var iterator1 = function(callback1) {
                if (time > budgets[index1].EndDate && budgets[index1].State == 'valid') {
                    db.collection('budgets').update({
                            BudgetName: budgets[index1].BudgetName
                        }, {
                            $set: {
                                State: 'invalid'
                            }
                        }, function() {
                            setTimeout(function() {
                                db.collection('notifications').insert({
                                    NotificationType: 'BudgetTimeOut',
                                    NotificationData: budgets[index1].BudgetName,
                                    Seen: 'false',
                                    Time: time
                                }, function(err) {
                                    if (err) throw err;
                                    console.log('Added a notification')

                                    callback1();
                                });
                            }, 0);
                        }
                    );
                } else {
                    callback1();

                }
            };
            if (budgets.length != 0) {
                controller1();
            }
        });
    });
};

//append '0' to single digit months
var checkDate = function(val) {
    val = String(val);
    if (val < 10) val = '0' + val;
    return val;
};

// get all {services: {instances}} associated to an 'invalid' budget
// result format: 
// [ { _id: 'Amazon RDS Service', ResourceId: [ 'arn:aws:rds:us-east-1:092841396837:db:msmit' ] },
// { _id: 'Amazon Elastic Compute Cloud', ResourceId: [ 'vol-f377d3bd', 'i-a717b04e'] } ]
var getBatchInstances = function(budget,callback){
    if(budget.BatchType == 'user'){
        mongoose.model('Billings').aggregate([{
            $match: {
                $and: [{
                    UsageStartDate: {
                        $gte: budget.StartDate
                    }
                }, {
                    UsageStartDate: {
                        $lte: budget.EndDate
                    }
                }, {
                    'user:Name': budget.BatchName
                }, {
                    'user:Group': 'null'
                }]
            }
        }, {
            $project: {
                _id: 0,
                ResourceId: 1,
                ProductName: 1
            }
        }, {
            $group: {
                _id: "$ProductName",
                ResourceId: {
                    $addToSet: "$ResourceId"
                }
            }
        }]).exec(function(e, resouces) {
            stopBatchInstances(resouces);
            callback();
        });
    }else{
        mongoose.model('Billings').aggregate([{
            $match: {
                $and: [{
                    UsageStartDate: {
                        $gte: budget.StartDate
                    }
                }, {
                    UsageStartDate: {
                        $lte: budget.EndDate
                    }
                }, {
                    'user:Group': budget.BatchName
                }]
            }
        }, {
            $project: {
                _id: 0,
                ResourceId: 1,
                ProductName: 1
            }
        }, {
            $group: {
                _id: "$ProductName",
                ResourceId: {
                    $addToSet: "$ResourceId"
                }
            }
        }]).exec(function(e, resouces) {
            stopBatchInstances(resouces);
            callback();
        });
    }
}

var stopBatchInstances = function(serviceResources){
    var index1 = 0;
    var controller1 = function() {
        iterator1(function() {
            index1++;
            if (index1 < serviceResources.length) controller1();
            else {

            }
        });
    };
    var iterator1 = function(callback1) {
        switch(serviceResources[index1]._id){
            case 'Amazon Elastic Compute Cloud':
                var resources = serviceResources[index1].ResourceId;
                var index2 = 0;
                var controller2 = function() {
                    iterator2(function() {
                        index2++;
                        if (index2 < resources.length) controller2();
                        else {
                            callback1();
                        }
                    });
                };
                var iterator2 = function(callback2) {
                    if(/^i-/.test(resources[index2])){
                        // the code to stop ec2 instances goes here
                        // instanceId is in resources[index2]
                        // console.log(resources[index2])
                        callback2();
                    }else{
                        callback2();
                    }                                      
                };
                controller2();
                break;
            case 'Amazon RDS Service':
                var resources = serviceResources[index1].ResourceId;
                var index2 = 0;
                var controller2 = function() {
                    iterator2(function() {
                        index2++;
                        if (index2 < resources.length) controller2();
                        else {
                            callback1();
                        }
                    });
                };
                var iterator2 = function(callback2) {
                    // the code to stop rds instances goes here
                    // rds resource arn is in resources[index2]
                    // console.log(resources[index2])
                    callback2();                                     
                };
                controller2();
                break;
            default:
                callback1();
                break;
        }
    };
    controller1();
}

// sample call for testing purpose
getBatchInstances({
    "BudgetName" : "budget1",
    "BatchType" : "group",
    "BatchName" : "awsDelegator",
    "StartDate" : "2015-06-01 00:00:00",
    "EndDate" : "2015-08-01 00:00:00",
    "Amount" : 100,
    "State" : "valid",
    "TimeOut" : "true"
},function(){
    process.exit(0);
});