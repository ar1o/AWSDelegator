var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

exports.checkBudgets = function() {
    var currentTime = new Date();
    var time = currentTime.getFullYear() + '-' + checkDate((currentTime.getMonth() + 1)) + '-' +
        checkDate(currentTime.getDate()) + ' ' + checkDate(currentTime.getHours()) + ':' +
        checkDate(currentTime.getMinutes()) + ':' + checkDate(currentTime.getSeconds());
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        mongoose.model('Budgets').find({}, function(e, d) {
            if (e) throw e;
            var index1 = 0;
            var controller1 = function() {
                iterator1(function() {
                    index1++;
                    if (index1 < d.length) controller1();
                });
            };
            var iterator1 = function(callback1) {
                console.log('time', time)
                console.log('EndDate', d[index1])
                console.log(typeof(time), typeof(d[index1].EndDate));
                if (time > d[index1].EndDate && d[index1].TimeOut == 'true' && d[index1].State == 'valid') {
                    console.log("HIT");
                    db.collection('budgets').update({
                            BudgetName: d[index1].BudgetName
                        }, {
                            $set: {
                                State: 'invalid'
                            }
                        }, {
                            // upsert: true
                        },
                        function() {
                            setTimeout(function() {
                                db.collection('notifications').insert({
                                    NotificationType: 'BudgetTimeOut',
                                    NotificationData: d[index1].BudgetName,
                                    Seen: 'false',
                                    Time: time
                                }, function(err) {
                                    if (err) throw err;
                                    console.log('done')
                                    callback1();
                                });
                            }, 0);
                        }
                    );
                }
            };
            if (d.length != 0) {
                controller1();
            }
        });
    });
};

var checkDate = function(val) {
    val = String(val);
    if (val < 10) val = '0' + val;
    return val;
};







// var stopBatchInstances = function(budget,callback){
//     if(budget.BatchType == 'user'){
//         mongoose.model('Billings').aggregate([{
//             $match: {
//                 $and: [{
//                     UsageStartDate: {
//                         $gte: budget.StartDate
//                     }
//                 }, {
//                     UsageStartDate: {
//                         $lte: budget.EndDate
//                     }
//                 }, {
//                     'user:Name': budget.BatchName
//                 }, {
//                     'user:Group': 'null'
//                 }]
//             }
//         }, {
//             $project: {
//                 _id: 0,
//                 ResourceId: 1,
//                 ProductName: 1
//             }
//         }, {
//             $group: {
//                 _id: "$ProductName",
//                 ResourceId: {
//                     $addToSet: "$ResourceId"
//                 }
//             }
//         }]).exec(function(e, resouces) {
//             mongoose.model('Notification').save()
//             callback();
//         });
//     }else{
//         mongoose.model('Billings').aggregate([{
//             $match: {
//                 $and: [{
//                     UsageStartDate: {
//                         $gte: budget.StartDate
//                     }
//                 }, {
//                     UsageStartDate: {
//                         $lte: budget.EndDate
//                     }
//                 }, {
//                     'user:Group': budget.BatchName
//                 }]
//             }
//         }, {
//             $project: {
//                 _id: 0,
//                 ResourceId: 1,
//                 ProductName: 1
//             }
//         }, {
//             $group: {
//                 _id: "$ProductName",
//                 ResourceId: {
//                     $addToSet: "$ResourceId"
//                 }
//             }
//         }]).exec(function(e, resouces) {
//             // Notification(resouces,callback);
//             callback();
//         });
//     }
// }