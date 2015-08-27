/*
    Get EC2 cloudwatch metrics from database
 */
exports.metrics = function(req, res) {
    var instanceId = req.query.instance;
    mongoose.model('ec2Metrics').aggregate([{
        $match: {
            InstanceId: {
                $eq: instanceId
            }
        }
    }, {
        $project: {
            _id: 0,
            InstanceId: 1,
            NetworkIn: 1,
            NetworkOut: 1,
            CPUUtilization: 1,
            Time: 1
        }
    }, {
        $sort: {
            Time: 1
        }
    }]).exec(function(e, d) {
        res.send(d);
    });
}

/*
    Get JSON of EC2 instances from database
 */
exports.instances = function(req, res) {
    mongoose.model('ec2Instances').aggregate([{
        $project: {
            _id: 0,
            Id: 1,
            State: 1,
            Name: 1,
            Group: 1,
            Type: 1,
            LaunchTime: 1,
            Zone: 1,
            Lifetime: 1
        }
    }, {
        $sort: {
            State: 1
        }
    }]).exec(function(e, d) {
        if (e) throw e;
        res.send(d);
    });
}

/*
    Get percentage of operations used based on an EC2 instance
 */
exports.operations = function(req, res) {
    var instanceId = req.query.instance;
    var iOps = {},
        iOpPercent = {};
    // var volumes = [],vOps={},vOpPercent={};
    mongoose.model('Billings').find({
        ResourceId: instanceId
    }).exec(function(e, d) {
        var op;
        for (var i = 0 in d) {
            op = d[i].toJSON().Operation;
            if (!(op in iOps)) {
                iOps[op] = 1;
            } else {
                iOps[op] += 1;
            }
        }
        var iTotal = 0,
            iCount = 0;
        for (var i in iOps) {
            iTotal += iOps[i];
        }
        for (var i = 0 in iOps) {
            iOpPercent[i] = (iOps[i] / iTotal);
        }
        res.send(iOpPercent);
    });
}