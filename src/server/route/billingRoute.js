//function/query to take a instance RID value, and sum both nonfree cost, and cost for per hour, then add theses values per hour
exports.calcTotalCost = function(req, res) {
    var rid = req.query.instance;

    mongoose.model('ec2Instances').findOne({
        Id: rid
    }).exec(function(e,d1){
        if(e) throw e;
        mongoose.model('Billings').aggregate([
            {
                $match: {
                    $or: [{ResourceId: {$eq: rid}},{ ResourceId: {$in : d1.VolumeId}}]
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
    })        
}

exports.operationCost = function(req, res) {
    var operation = req.query.operation;
    var instance = req.query.instance;
    var productName = req.query.productName;
    mongoose.model('Billings').aggregate([
        {
            $match: {
                Cost: {
                    $gt: 0
                },
                ProductName: {
                    $eq: productName
                },
                ResourceId: {
                    $eq: instance
                },
                Operation: {
                    $eq: operation
                }
            }
        }, {
            $project: {
                _id: 0,
                Cost: 1,
                UsageStartDate: 1
            }
        }, {
            $sort: {
                UsageStartDate: 1
            }
        }
    ]).exec(function(e,d){
        if(e) throw e;
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
        $project: {
            _id: 1,
            Cost: 1,
            ProductName: 1,
            UsageStartDate: 1
        }
    }, {
        $group: {
            _id: {
                "UsageStartDate":{$substr: ['$UsageStartDate', 0, 7]}, "ProductName":"$ProductName" 
            },
            Total: {
                $sum: "$Cost"
            },
        }
    }, {
        $sort: {
            _id: 1
        }
    }]).exec(function(e, d) {
        var result = {};
        result = {
            data: d,
            stack: "Free-tier"
        }
        res.send(d);
    });
};

exports.groupByMonthNF = function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            $or: [{Cost: {
                $gt: 0
            }},{NonFreeCost: {$gt: 0}}]
        }
    }, {
        $project: {
            _id: 1,
            Cost: 1,
            NonFreeCost: 1,
            ProductName: 1,
            UsageStartDate: 1
        }
    }, {
        $group: {
            _id: {
                  "UsageStartDate":{$substr: ['$UsageStartDate', 0, 7]}, "ProductName":"$ProductName"
            },
            TCost: {
                $sum: "$Cost"
            },
            TNonFreeCost: {
                $sum: "$NonFreeCost"
            }
        }
    }, {
        $project: {
            _id: 1,
            Total: {
                $add: ['$TNonFreeCost', '$TCost']
            }
        }
    }, {
        $sort: {
            _id: 1
        }
    }]).exec(function(e, d) {
        var result = {};
        result = {
            data: d,
            stack: "Non-free-tier"
        }
        res.send(d);
    });
};

/*
 * Query EC2 instances for hourly cost. 
 */
exports.instanceCostAll = function(req, res) {
    var instanceId = req.query.instance;
    mongoose.model('ec2Instances').findOne({
        Id: instanceId
    }).exec(function(e,d1){
        if(e) throw e;
        mongoose.model('Billings').aggregate([
        {
            $match: {
                $or: [{ResourceId: {$eq: instanceId}},{ ResourceId: {$in : d1.VolumeId}}]
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
    });
};
