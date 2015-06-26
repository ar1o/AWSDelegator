//function/query to take a instance RID value, and sum both nonfree cost, and cost for per hour, then add theses values per hour

exports.calcTotalCost = function(req, res) {
    console.log(req.query.instance);
    console.log(req.query.volume);
    var rid = req.query.instance;
    var vid = req.query.volume;
    console.log("ResourceId:", rid);
    mongoose.model('Billings').aggregate([
        {
            $match: {
                $or: [{ResourceId: {$eq: rid}},{ ResourceId: {$eq: vid}}]
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
        // var conditions = {
        //     };
        //     var update = {
        //     };
        //     var options = {
            //      multi = true
        //     };
        //     mongoose.model('Billings').update(conditions, update, options, callback);


        // function callback(err, numAffected) {
        //         console.log(numAffected)
        //     };
        res.send(d);
    });
}

exports.calcFreeTierCost = function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            ItemDescription: {
                $regex: /free tier/
            }
        }
    }, {
        $project: {
            _id: 1,
            Rate: 1,
            UsageQuantity: 1,
            ResourceId: 1,
            Cost: {
                $multiply: ["$Rate", "$UsageQuantity"]
            }
        }
    }]).exec(function(e, d) {
        for (var i in d) {
            // console.log(d[i]._id + "\t" + d[i].Cost + "\t" + d[i].Rate);
            var conditions = {
                _id: {
                    $eq: d[i]._id
                }
            };
            var update = {
                Cost: d[i].Cost
            };
            var options = {
                multi: true //Should consider removing multi : true, as it already iterates
            };
            mongoose.model('Billings').update(conditions, update, options, callback);

            function callback(err, numAffected) {
                console.log(numAffected)
            };
        }
        res.send(d);
    });
};

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


// exports.monthToDate = function(req, res) {
//     mongoose.model('Billings').aggregate([{
//         $project: {
//             _id: 0,
//             ResourceId: 1,
//             Cost: 1,
//             ProductName: 1,
//             UsageStartDate: 1
//         }
//     }, {
//         $group: {
//             _id: {
//                 UsageStartDate: "$UsageStartDate",
//                 ProductName: "$ProductName"
//             },
//             Total: {
//                 $sum: "$Cost"
//             }
//         }
//     }, {
//         $sort: {
//             _id: 1 // Need to sort by date.
//         }
//     }]).exec(function(e, d) {
//         console.log(d[0]);



//         res.send(d);
//     });
// };

// exports.instanceCost = function(req, res) {
//     var instances = {};
//     var count = 0;
//     // Select objects from collection
//     mongoose.model('Billings').aggregate([{
//         $match: {
//             Cost: {
//                 $gte: 0
//             },
//             ResourceId: {
//                 $regex: '^(i-)'
//             }
//         }
//     }, {
//         $group: {
//             _id: "$ResourceId",
//             "user:Volume Id": {
//                 $addToSet: "$user:Volume Id"
//             },
//             total: {
//                 $sum: "$Cost"
//             }
//         }
//     }]).exec(function(e, d) {
//         //loop over these objects, create an array of your foreign keys and a hashmap of our objects stored by ID
//         //(so that later we can do yourHashmap[some_id] to get your object from collection)
//         for (var r in d) {
//             if (d[r]['user:Volume Id'][0] == 'null') {
//                 instances[d[r]._id] = {
//                     resourceId: d[r]._id,
//                     volumeId: d[r]['user:Volume Id'][0],
//                     cost: d[r].total
//                 };
//             } else {
//                 instances[d[r]['user:Volume Id'][0]] = {
//                     volumeId: d[r]['user:Volume Id'][0],
//                     resourceId: d[r]._id,
//                     cost: d[r].total
//                 };
//             }
//             count++;
//         }

//         mongoose.model('Billings').aggregate({
//             $match: {
//                 Cost: {
//                     $gte: 0
//                 },
//                 "user:Volume Id": {
//                     $regex: '^(vol-)'
//                 }
//             }
//         }, {
//             $group: {
//                 _id: "$user:Volume Id",
//                 ResourceId: {
//                     $addToSet: "$ResourceId"
//                 },
//                 total: {
//                     $sum: "$Cost"
//                 }
//             }
//         }).exec(function(e, d) {
//             //loop over collection B and use the foreign key on collection to access our objects from
//             //collection using the hashmap we built
//             for (var r in d) {
//                 //now we have the matching collection A and collection B objects and we can do whatever
//                 //you want with them.
//                 if (d[r]._id in instances) {
//                     instances[d[r]._id].cost += d[r].total;
//                 }
//             }
//             res.send(instances);
//         });

//     });
// };

/*
 * Query EC2 instances for hourly cost. 
 */
exports.instanceCostAll = function(req, res) {
    // console.log("Cost request",req.query.instance);
    var instanceId = req.query.instance;
    var volumeId;
    //instances hashmap
    var instances = {};

    // Query instances collection to associate volumeIds to instanceIds. 
    mongoose.model('ec2Instances').aggregate([{
        $match: {
            Id: {
                $eq: instanceId
            }
        }
    }, {
        $project: {
            _id: 0,
            VolumeId: 1
        }
    }]).exec(function(err, result) {
        // console.log(result[0].VolumeId[0]);
        // console.log(instanceId);
        volumeId = result[0].VolumeId[0]

        //query billing collection for cost on EC2 resourceId's
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
                VolumeId: {
                    $addToSet: volumeId
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
            // Create a hashmap of instances
            for (var r in d) {
                instances[d[r]._id] = {
                    resourceId: d[r].ResourceId[0],
                    volumeId: d[r].VolumeId[0],
                    cost: d[r].Total,
                    date: d[r]._id
                };
            }
            // Query billings collection for volumeId costs.
            mongoose.model('Billings').aggregate({
                $match: {
                    ResourceId: {
                        $eq: volumeId
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
                    VolumeId: {
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
            }).exec(function(e, d) {
                // Total up the costs of volumeId with respective instanceId's or that hour.
                for (var r in d) {
                    if (d[r]._id in instances) {
                        instances[d[r]._id].cost += d[r].Total;
                    }
                }
                // Send to endpoint.
                res.send(instances);
            });
        });
    });
};


// exports.instanceCostHourlyByDate = function(req, res) {
//     var startDuration = "2015-06-03 00:00:00";
//     var endDuration = "2015-06-03 23:00:00"
//     var instances = {};
//     // var count = 0;
//     // Select objects from collection
//     mongoose.model('Billings').aggregate([{
//         $match: {
//             Cost: {
//                 $gte: 0
//             },
//             ResourceId: {
//                 $regex: '^(i-)'
//             },
//             $and: [{
//                 UsageStartDate: {
//                     $gte: startDuration
//                 }
//             }, {
//                 UsageStartDate: {
//                     $lte: endDuration
//                 }
//             }]
//         }
//     }, {
//         $group: {
//             _id: "$ResourceId",
//             "user:Volume Id": {
//                 $addToSet: "$user:Volume Id"
//             },
//             "UsageStartDate": {
//                 $addToSet: "$UsageStartDate"
//             },
//             total: {
//                 $sum: "$Cost"
//             }
//         }
//     }]).exec(function(e, d) {
//         // console.log("\nINSTANCE COST");

//         // console.log(d);
//         // loop over these objects, create an array of your foreign keys and a hashmap of our objects stored by ID
//         // (so that later we can do yourHashmap[some_id] to get your object from collection)
//         for (var r in d) {
//             if (d[r]['user:Volume Id'][0] == 'null') {
//                 instances[d[r]._id] = {
//                     resourceId: d[r]._id,
//                     volumeId: d[r]['user:Volume Id'][0],
//                     cost: d[r].total
//                 };
//             } else {
//                 instances[d[r]['user:Volume Id'][0]] = {
//                     volumeId: d[r]['user:Volume Id'][0],
//                     resourceId: d[r]._id,
//                     cost: d[r].total
//                 };
//             }
//             // count++;

//             // console.log("instanceLENGTH: " + Object.keys(instances).length);
//             // console.log(d[r]._id + "\t" + d[r]['user:Volume Id'][0] + "\t" + d[r].total);
//         }

//         mongoose.model('Billings').aggregate({
//             $match: {
//                 Cost: {
//                     $gte: 0
//                 },
//                 "user:Volume Id": {
//                     $regex: '^(vol-)'
//                 },
//                 $and: [{
//                     UsageStartDate: {
//                         gte: startDuration
//                     }
//                 }, {
//                     UsageStartDate: {
//                         lte: endDuration
//                     }
//                 }]

//             }
//         }, {
//             $group: {
//                 _id: "$user:Volume Id",
//                 ResourceId: {
//                     $addToSet: "$ResourceId"
//                 },
//                 total: {
//                     $sum: "$Cost"
//                 }
//             }
//         }).exec(function(e, d) {
//             // console.log(d);
//             // console.log("instanceLENGTH: " + Object.keys(instances).length);
//             // console.log("\nVOLUME COST")
//             //loop over collection B and use the foreign key on collection to access our objects from
//             //collection using the hashmap we built
//             for (var r in d) {
//                 // console.log(d[r].resourceId + "\t" + d[r]._id + "\t" + d[r].total);
//                 //now we have the matching collection A and collection B objects and we can do whatever
//                 //you want with them.
//                 if (d[r]._id in instances) {
//                     instances[d[r]._id].cost += d[r].total;
//                 }
//             }
//             // var total_cost = 0;
//             // console.log("\nTOTAL COST")
//             // for (var x in instances) {
//             // total_cost += instances[x].cost;
//             // console.log(instances[x].resourceId + "\t" + instances[x].cost + "\t" + instances[x].volumeId + "\t" + total_cost + "\t" + count);
//             // }
//             res.send(instances);
//         });

//     });
// };
