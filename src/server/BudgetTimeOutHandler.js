/*
    Checks COST budgets for time duration exceed
 */
exports.checkBudgets = function() {
    var currentTime = new Date();
    //time format: '2015-07-22 23:50:20'
    var time = currentTime.getFullYear() + '-' + checkDate((currentTime.getMonth() + 1)) + '-' +
        checkDate(currentTime.getDate()) + ' ' + checkDate(currentTime.getHours()) + ':' +
        checkDate(currentTime.getMinutes()) + ':' + checkDate(currentTime.getSeconds());
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        mongoose.model('Budgets').find({}, function(e, budgets) {
            // console.log("hehe",budgets)
            if (e) throw e;
            var index = 0;
            var budgetController = function() {
                budgetIterator(function() {
                    index++;
                    if (index < budgets.length) {
                        budgetController();
                    }
                });
            };
            var budgetIterator = function(callback1) {
                var budget = budgets[index];

                //checking for amount exceeded or time exceeded
                getBudgetTotalCost(budgets[index].BatchType, budgets[index].BatchName, budgets[index].StartDate, budgets[index].EndDate,
                    function(result) {
                        if (result[0].Total >= budget.Amount && budget.State == 'valid') { //Check if ammount exceeded
                            db.collection('budgets').update({
                                BudgetName: budget.BudgetName
                            }, {
                                $set: {
                                    State: 'invalid'
                                }
                            }, function() {
                                setTimeout(function() {
                                    db.collection('notifications').insert({
                                        NotificationType: 'BudgetCostExceeded',
                                        NotificationData: budget.BudgetName,
                                        Seen: 'false',
                                        Time: time
                                    }, function(err) {
                                        if (err) throw err;
                                        console.log('Added a notification for ', budget.BudgetName);
                                        //Check for stop the instance here
                                        if (budget.timeout == 'true') {
                                            console.log("Stopping instance as requested...")
                                            stopInstances(budgets[index].BatchType, budgets[index].BatchName);
                                        }
                                        callback1();
                                    });
                                }, 0);
                            });
                        } else if (time > budget.EndDate && budget.State == 'valid') { //Check if date expired
                            db.collection('budgets').update({
                                BudgetName: budget.BudgetName
                            }, {
                                $set: {
                                    State: 'invalid'
                                }
                            }, function() {
                                setTimeout(function() {
                                    db.collection('notifications').insert({
                                        NotificationType: 'BudgetTimeOut',
                                        NotificationData: budget.BudgetName,
                                        Seen: 'false',
                                        Time: time
                                    }, function(err) {
                                        if (err) throw err;
                                        console.log('Added a notification', budget.BudgetName)
                                        //Also stop the instance here
                                        if (budget.timeout == 'true') {
                                            console.log("Stopping instance as requested...")
                                            stopInstances(budgets[index].BatchType, budgets[index].BatchName);
                                        }
                                        callback1();
                                    });
                                }, 0);
                            });
                        } else {
                            return callback1();
                        }
                    });
            };
            if (budgets.length > 0) {
                budgetController();
            }
        });
    });
};

/*
    Stop an instance given the batch type and batch name
 */
var stopInstances = function(batchtype, batchname) {
    getInstanceId(batchtype, batchname,
        function(result) {
            var index1 = 0;
            var ec2;
            var _zone;
            var controller5 = function() {

                var i = 0;
                while (i < result[index1].Zone.length) {

                    if (result[index1].Zone[i] == 'null') {
                        i++;
                    } else {
                        _zone = result[i].Zone[i];
                        break;
                    }
                    if (result[index1].Zone.length == 1 && result[index1].Zone[i] == 'null') {
                        controller5();
                    }
                }
                iterator5(function() {
                    index1++;
                    if (index1 < result.length) {
                        controller5();
                    }
                });
            };

            var iterator5 = function(callback1) {
                //check for rds or ec2 here
                if (_zone != undefined && /^i-/.test(result[index1]._id)) {

                    var instanceZone = _zone.substring(0, 9);
                    //     callback1();    
                    ec2 = new AWS.EC2({
                        region: instanceZone
                    });

                    var params = {
                        InstanceIds: [result[index1]._id]
                            // DryRun: true
                            // Force: true || false
                    };

                    ec2.stopInstances(params, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else console.log(data); // successful response
                    });
                    callback1();
                } else if (_zone != undefined && /^arn:aws:rds/.test(result[index1]._id)) {
                    console.log('There is no "stop/start" actions for RDS databases,' +
                        'currently you would have to terminate the database taking a final snapshot' +
                        'and restore from that snapshot.');
                    //add a notiication for this
                    db.collection('notifications').insert({
                        NotificationType: 'RDS-Stop',
                        NotificationData: 'There is no "stop/start" actions for RDS databases,' +
                            'currently you would have to terminate the database taking a final snapshot' +
                            'and restore from that snapshot.',
                        Seen: 'false',
                        Time: time
                    }, function(err) {
                        if (err) throw err;
                        callback1();
                    });
                    //rds-create-db-snapshot
                    //rds-delete-db-instance
                    //rds-restore-db-instance-from-db-snapshot
                } else {
                    callback1();
                }

            };
            controller5();
        }); //end get instnaceid
}


/*
    Query the instance id(s) of the budgets.
 */
var getInstanceId = function(_batchtype, _batchname, callback) {
    var batchType = _batchtype;
    var batchName = _batchname;

    if (batchType == 'user') {
        mongoose.model('Billings').aggregate([{
            $match: {
                $and: [{
                    'user:Name': batchName
                }, {
                    'user:Group': 'null'
                }]
            }
        }, {
            $project: {
                _id: 0,
                ResourceId: 1,
                AvailabilityZone: 1
            }
        }, {
            $group: {
                _id: "$ResourceId",
                Zone: {
                    $addToSet: "$AvailabilityZone"
                }
            }
        }]).exec(function(e, d) {
            if(d.length > 0) {
                callback(d);
            }
        });
    } else {
        mongoose.model('Billings').aggregate([{
            $match: {
                $and: [{
                    'user:Group': batchName
                }]
            }
        }, {
            $project: {
                _id: 1,
                ResourceId: 1,
                AvailabilityZone: 1
            }
        }, {
            $group: {
                _id: "$ResourceId",
                Zone: {
                    $addToSet: "$AvailabilityZone"
                }
                // Zone: {
                //     $push: "$AvailabilityZone"
            }
        }]).exec(function(e, d) {
             if(d.length > 0) {
                callback(d);
            }
        });
    }
}

/*
    Query the amount the budget has currently incurred.
 */
var getBudgetTotalCost = function(_batchtype, _batchname, _startdate, _enddate, callback) {
    var batchType = _batchtype;
    var batchName = _batchname;
    var startDate = _startdate;
    var endDate = _enddate;
    if (batchType == 'user') {
        mongoose.model('Billings').aggregate([{
            $match: {
                $and: [{
                    UsageStartDate: {
                        $gte: startDate
                    }
                }, {
                    UsageStartDate: {
                        $lte: endDate
                    }
                }, {
                    'user:Name': batchName
                }, {
                    'user:Group': 'null'
                }]
            }
        }, {
            $project: {
                _id: 0,
                UsageStartDate: 1,
                Cost: 1
            }
        }, {
            $group: {
                _id: null,
                Cost: {
                    $sum: "$Cost"
                }
            }
        }, {
            $sort: {
                _id: 1
            }
        }]).exec(function(e, d) {
            if(d.length > 0) {
                callback(d);
            }
        });
    } else { // If group instead
        mongoose.model('Billings').aggregate([{
                $match: {
                    $and: [{
                        UsageStartDate: {
                            $gte: startDate
                        }
                    }, {
                        UsageStartDate: {
                            $lte: endDate
                        }
                    }, {
                        'user:Group': batchName
                    }]
                }
            }, {
                $project: {
                    _id: 0,
                    UsageStartDate: 1,
                    Cost: 1,
                }
            }, {
                $group: {
                    _id: null,
                    Total: {
                        $sum: "$Cost"
                    },
                    Group: {
                        $addToSet: batchName
                    }
                }
            }, {
                $project: {
                    _id: 0,
                    Total: 1,
                    Group: 1
                }
            }, {
                $sort: {
                    _id: 1
                }
            }])
            .exec(function(e, d) {
                if(d.length > 0) {
                    callback(d);
                }
            });
    }
    // return 0;
}


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
var getBatchInstances = function(budget, callback) {
    if (budget.BatchType == 'user') {
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
    } else {
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

var stopBatchInstances = function(serviceResources) {
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
        switch (serviceResources[index1]._id) {
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
                    if (/^i-/.test(resources[index2])) {
                        // the code to stop ec2 instances goes here
                        // instanceId is in resources[index2]
                        // console.log(resources[index2])
                        callback2();
                    } else {
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
// getBatchInstances({
//     "BudgetName" : "budget1",
//     "BatchType" : "group",
//     "BatchName" : "awsDelegator",
//     "StartDate" : "2015-06-01 00:00:00",
//     "EndDate" : "2015-08-01 00:00:00",
//     "Amount" : 100,
//     "State" : "valid",
//     "TimeOut" : "true"
// },function(){
//     process.exit(0);
// });