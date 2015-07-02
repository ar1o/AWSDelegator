//function/query to take a instance RID value, and sum both nonfree cost, and cost for per hour, then add theses values per hour
exports.calcTotalCost = function(req, res) {
    var rid = req.query.instance;
    var vid =req.query.volume;
    vid = vid.split(',');
    mongoose.model('Billings').aggregate([
        {
            $match: {
                $or: [{ResourceId: {$eq: rid}},{ ResourceId: {$in : vid}}]
            }
        },{

            $project: {
                _id: 1,
                UsageStartDate: 1,
                ResourceId: 1,
                Cost: 1,
                NonFreeCost: 1
            }
        },{
            $group: {
                _id: "$UsageStartDate",
                ResourceId: {
                    $addToSet: "$ResourceId"
                },
                Cost: {
                    $addToSet: "$Cost"
                },
                TCost: {
                    $sum: "$Cost"
                },
                NonFreeCost: {
                    $addToSet: "$NonFreeCost"
                },
                TNonFreeCost: {
                    $sum: "$NonFreeCost"
                }
            }
        },{
            $project: {
                _id: 1,
                VolumeId: 1,
                ResourceId: 1,
                Total: {
                    $add: ['$TNonFreeCost', '$TCost']
                }
            }
        },{
            $sort: {
                _id: 1
            }
        
        }
    ]).exec(function(e, d) {
        res.send(d);
    });
}

exports.totalCostProduct = function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gt: 0
            }
        }
    }, {
        $project: {
            _id: 1,
            ResourceId: 1,
            Cost: 1,
            ProductName: 1,
            UsageStartDate: 1
        }
    }, {
        $group: {
            _id: "$ProductName",
            Total: {
                $sum: "$Cost"
            }
        }
    }]).exec(function(e, d) {
        if(e) throw e;
        var totalCostProduct = {};
        totalCostProduct = {
            data: d,
            month: "05",
            year: "2015" 
        }
        res.send(totalCostProduct);
    });
};


exports.hourlyCostProduct = function(req, res) {
    var productName = req.query.productName;
    var productName = 'Amazon Elastic Compute Cloud'
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
    }, {
        $sort: {
            _id: 1
        }
    }]).exec(function(e, d) {
        res.send(d);
    });
};

exports.groupByMonth = function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gt: 0
            }
        }
    }, {
        $group: {
            _id: {$substr: ['$UsageStartDate', 0, 7]},             
            Total: {
                $sum: "$Cost"
            }
        }
    }, {
        $sort: {
            _id: 1
        }
    }]).exec(function(e, d) {
        res.send(d);
    });
};


/*
 * Query EC2 instances for hourly cost. 
 */
exports.instanceCostAll = function(req, res) {
    var instanceId = req.query.instance;
    var volumeId = req.query.volume;
    volumeId = volumeId.split(',');


        mongoose.model('Billings').aggregate([
        {
            $match: {
                $or: [{ResourceId: {$eq: instanceId}},{ ResourceId: {$in : volumeId}}]
            }
        },{

            $project: {
                _id: 1,
                UsageStartDate: 1,
                ResourceId: 1,
                Cost: 1,
            }
        },{
            $group: {
                _id: "$UsageStartDate",
                ResourceId: {
                    $addToSet: "$ResourceId"
                },
                Cost: {
                    $addToSet: "$Cost"
                },
                Total: {
                    $sum: "$Cost"
                }
            }
        },{
            $sort: {
                _id: 1
            }
        
        }
    ]).exec(function(e, d) {
        res.send(d);
    });
};
