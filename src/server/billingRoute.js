//Query all the product costs month to date
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
        console.log(d)
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
                multi: true
            };
            mongoose.model('Billings').update(conditions, update, options, callback);

            function callback(err, numAffected) {
                console.log(numAffected)
            };
        }
        res.send(d);
    });
};



//Query all the product costs month to date
exports.monthToDate = function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gte: 0
            },
            $or: [{
                ResourceId: {
                    $regex: '^(i-)'
                }
            }, {
                ResourceId: {
                    $regex: '^(vol-)'
                }
            }]
        }
    }, {
        $group: {
            _id: "$ProductName",
            total: {
                $sum: "$Cost"
            }
        }
    }]).exec(function(e, d) {
        console.log(d)
        res.send(d);
    });
};

//Query the total cost of a product by that hour
exports.byHour = function(req, res) {
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gte: 0
            },
            ProductName: {
                $eq: "Amazon Elastic Compute Cloud"
            },
            UsageStartDate: {
                $eq: "2015-05-01 00:00:00"
            }
        }
    }, {
        $group: {
            _id: "$ProductName",
            total: {
                $sum: "$Cost"
            }
        }
    }]).exec(function(e, d) {
        // console.log(d);
        res.send(d);
    });
};


exports.instanceCost = function(req, res) {
    var instances = {};
    var count = 0;
    // Select objects from collection
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gte: 0
            },
            ResourceId: {
                $regex: '^(i-)'
            }
        }
    }, {
        $group: {
            _id: "$ResourceId",
            "user:Volume Id": {
                $addToSet: "$user:Volume Id"
            },
            total: {
                $sum: "$Cost"
            }
        }
    }]).exec(function(e, d) {
        //loop over these objects, create an array of your foreign keys and a hashmap of our objects stored by ID
        //(so that later we can do yourHashmap[some_id] to get your object from collection)
        for (var r in d) {
            if (d[r]['user:Volume Id'][0] == '') {
                d[r]['user:Volume Id'][0] = "null"
                instances[d[r]._id] = {
                    resourceId: d[r]._id,
                    volumeId: d[r]['user:Volume Id'][0],
                    cost: d[r].total
                };
            } else {
                instances[d[r]['user:Volume Id'][0]] = {
                    volumeId: d[r]['user:Volume Id'][0],
                    resourceId: d[r]._id,
                    cost: d[r].total
                };
            }
            count++;
        }

        mongoose.model('Billings').aggregate({
            $match: {
                Cost: {
                    $gte: 0
                },
                "user:Volume Id": {
                    $regex: '^(vol-)'
                }
            }
        }, {
            $group: {
                _id: "$volumeId",
                ResourceId: {
                    $addToSet: "$ResourceId"
                },
                total: {
                    $sum: "$Cost"
                }
            }
        }).exec(function(e, d) {
            //loop over collection B and use the foreign key on collection to access our objects from
            //collection using the hashmap we built
            for (var r in d) {
                //now we have the matching collection A and collection B objects and we can do whatever
                //you want with them.
                if (d[r]._id in instances) {
                    instances[d[r]._id].cost += d[r].total;
                }
            }
            console.log(instances);
            res.send(instances);
        });

    });
};


exports.instanceCostHourly = function(req, res) {
    var instances = {};
    var count = 0;
    // Select objects from collection
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gte: 0
            },
            ResourceId: {
                $regex: '^(i-)'
            }
        }
    }, {
        $group: {
            _id: "$ResourceId",
            "user:Volume Id": {
                $addToSet: "$user:Volume Id"
            },
            total: {
                $sum: "$Cost"
            }
        }
    }]).exec(function(e, d) {
        console.log("\nINSTANCE COST");
        //loop over these objects, create an array of your foreign keys and a hashmap of our objects stored by ID
        //(so that later we can do yourHashmap[some_id] to get your object from collection)
        for (var r in d) {
            if (d[r]['user:Volume Id'][0] == '') {
                d[r]['user:Volume Id'][0] = "null"
                instances[d[r]._id] = {
                    resourceId: d[r]._id,
                    volumeId: d[r]['user:Volume Id'][0],
                    cost: d[r].total
                };
            } else {
                instances[d[r]['user:Volume Id'][0]] = {
                    volumeId: d[r]['user:Volume Id'][0],
                    resourceId: d[r]._id,
                    cost: d[r].total
                };
            }
            count++;
            // console.log("instanceLENGTH: " + Object.keys(instances).length);
            // console.log(d[r]._id + "\t" + d[r]['user:Volume Id'][0] + "\t" + d[r].total);
        }

        mongoose.model('Billings').aggregate({
            $match: {
                Cost: {
                    $gte: 0
                },
                "user:Volume Id": {
                    $regex: '^(vol-)'
                }
            }
        }, {
            $group: {
                _id: "$user:Volume Id",
                ResourceId: {
                    $addToSet: "$ResourceId"
                },
                total: {
                    $sum: "$Cost"
                }
            }
        }).exec(function(e, d) {
            // console.log(d);
            //loop over collection B and use the foreign key on collection to access our objects from
            //collection using the hashmap we built
            for (var r in d) {
                //now we have the matching collection A and collection B objects and we can do whatever
                //you want with them.
                if (d[r]._id in instances) {
                    instances[d[r]._id].cost += d[r].total;
                }
            }
            // var total_cost = 0;
            // console.log("\nTOTAL COST")
            // for (var x in instances) {
            // total_cost += instances[x].cost;
            // console.log(instances[x].resourceId + "\t" + instances[x].cost + "\t" + instances[x].volumeId + "\t" + total_cost + "\t" + count);
            // }
            console.log(instances);
            res.send(instances);
        });

    });
};

exports.instanceCostHourlyByDate = function(req, res) {
    var startDuration = "2015-05-25 00:00:00";
    var endDuration = "2015-05-25 23:00:00"
    var instances = {};
    var count = 0;
    // Select objects from collection
    mongoose.model('Billings').aggregate([{
        $match: {
            Cost: {
                $gte: 0
            },
            ResourceId: {
                $regex: '^(i-)'
            },
            $and: [{
                UsageStartDate: {
                    $gte: startDuration
                }
            }, {
                UsageStartDate: {
                    $lte: endDuration
                }
            }]
        }
    }, {
        $group: {
            _id: "$ResourceId",
            "user:Volume Id": {
                $addToSet: "$user:Volume Id"
            },
            "UsageStartDate": {
                $addToSet: "$UsageStartDate"
            },
            total: {
                $sum: "$Cost"
            }
        }
    }]).exec(function(e, d) {
        // console.log("\nINSTANCE COST");

        console.log(d);
        // loop over these objects, create an array of your foreign keys and a hashmap of our objects stored by ID
        // (so that later we can do yourHashmap[some_id] to get your object from collection)
        for (var r in d) {
            if (d[r]['user:Volume Id'][0] == '') {
                d[r]['user:Volume Id'][0] = "null"
                instances[d[r]._id] = {
                    resourceId: d[r]._id,
                    volumeId: d[r]['user:Volume Id'][0],
                    cost: d[r].total
                };
            } else {
                instances[d[r]['user:Volume Id'][0]] = {
                    volumeId: d[r]['user:Volume Id'][0],
                    resourceId: d[r]._id,
                    cost: d[r].total
                };
            }
            count++;

            // console.log("instanceLENGTH: " + Object.keys(instances).length);
            // console.log(d[r]._id + "\t" + d[r]['user:Volume Id'][0] + "\t" + d[r].total);
        }

        mongoose.model('Billings').aggregate({
            $match: {
                Cost: {
                    $gte: 0
                },
                "user:Volume Id": {
                    $regex: '^(vol-)'
                },
                $and: [{
                    UsageStartDate: {
                        gte: startDuration
                    }
                }, {
                    UsageStartDate: {
                        lte: endDuration
                    }
                }]

            }
        }, {
            $group: {
                _id: "$user:Volume Id",
                ResourceId: {
                    $addToSet: "$ResourceId"
                },
                total: {
                    $sum: "$Cost"
                }
            }
        }).exec(function(e, d) {
            // console.log(d);
            // console.log("instanceLENGTH: " + Object.keys(instances).length);
            // console.log("\nVOLUME COST")
            //loop over collection B and use the foreign key on collection to access our objects from
            //collection using the hashmap we built
            for (var r in d) {
                // console.log(d[r].resourceId + "\t" + d[r]._id + "\t" + d[r].total);
                //now we have the matching collection A and collection B objects and we can do whatever
                //you want with them.
                if (d[r]._id in instances) {
                    instances[d[r]._id].cost += d[r].total;
                }
            }
            // var total_cost = 0;
            // console.log("\nTOTAL COST")
            // for (var x in instances) {
            // total_cost += instances[x].cost;
            // console.log(instances[x].resourceId + "\t" + instances[x].cost + "\t" + instances[x].volumeId + "\t" + total_cost + "\t" + count);
            // }
            console.log(instances);
            res.send(instances);
        });

    });
};