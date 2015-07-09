exports.groups = function(req, res) {
    mongoose.model('iamGroups').aggregate([{
        $project: {
            _id: 0,
            GroupName: 1,
            Arn: 1,
            CreateDate: 1
        }
    }]).exec(function(e, d) {
        if (e) throw e;
        var index1 = 0;
        var controller1 = function() {
            iterator1(function() {
                index1++;
                if (index1 < d.length) controller1();
                else {
                    res.send(d);
                }
            });
        };
        var iterator1 = function(callback1) {    
            mongoose.model('Budgets').aggregate([{
                $match: {
                    $and: [{
                        BatchType: {
                            $eq: 'group'
                        }
                    }, {
                        BatchName: {
                            $eq: d[index1].GroupName
                        }
                    }]
                }
            }, {
                $project: {
                    _id: 0,
                    BudgetName: 1
                }
            }]).exec(function(e, d2) {
                if (d2.length == 0) {
                    d[index1]['BudgetName'] = ['null'];
                } else {
                    d[index1]['BudgetName'] = [];
                    for(var i in d2){
                        d[index1]['BudgetName'].push(d2[i].BudgetName);
                    }
                }
                callback1();
            });
        };
        controller1();
    });
}

exports.users = function(req, res) {
    mongoose.model('iamUsers').aggregate([{
        $project: {
            _id: 0,
            UserName: 1,
            Arn: 1,
            CreateDate: 1
        }
    }]).exec(function(e, d) {
        if (e) throw e;
        var index1 = 0;
        var controller1 = function() {
            iterator1(function() {
                index1++;
                if (index1 < d.length) controller1();
                else {
                    res.send(d);
                }
            });
        };
        var iterator1 = function(callback1) {    
            mongoose.model('Budgets').aggregate([{
                $match: {
                    $and: [{
                        BatchType: {
                            $eq: 'user'
                        }
                    }, {
                        BatchName: {
                            $eq: d[index1].UserName
                        }
                    }]
                }
            }, {
                $project: {
                    _id: 0,
                    BudgetName: 1
                }
            }]).exec(function(e, d2) {
                if (d2.length == 0) {
                    d[index1]['BudgetName'] = ['null'];
                } else {
                    d[index1]['BudgetName'] = [];
                    for(var i in d2){
                        d[index1]['BudgetName'].push(d2[i].BudgetName);
                    }
                }
                callback1();
            });
        };
        controller1();
    });
}