/*
* Query RDS instances for hourly cost. 
*/
exports.instanceCostAll = function(req, res) {
    var instanceId = req.query.instance;
    mongoose.model('Billings').aggregate([{
        $match: {
            ResourceId: {
                $eq: instanceId
            }
        }
    }, {
        $project: {
            _id: 0,
            ResourceId: 1,
            Cost: 1,
            UsageStartDate: 1
        }
    }, {
        $group: {
            _id: "$UsageStartDate",
            ResourceId: {
                $addToSet: "$ResourceId"
            },
            Total: {
                $sum: "$Cost"
            }
        }
    }, {
        $sort: {
            _id: 1 // Need to sort by date.
        }
    }]).exec(function(e, d) {
        res.send(d);
    });
};

exports.hourlyCostProduct = function(req, res) {
    var productName = 'Amazon RDS Service'
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gt: 0
            },
            ProductName: {
                $eq: productName
            }
        }
    }, {
        $group: {
            _id: "$UsageStartDate",
            Total: {
                $sum: "$Cost"
            }
        }
    },{
        $sort: {
            _id: 1
        }
    }]).exec(function(e, d) {
        res.send(d);
    });
};