exports.metrics = function(req, res) {
    console.log(req.query);
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
	}]).exec(function(e, d) {
		res.send(d);
	});
}

exports.instances = function(req, res) {
    mongoose.model('ec2Instances').aggregate([{
        $project: {
            _id:0,
            Id: 1,
            State: 1,
            ImageId: 1,
            KeyName: 1,
            Type: 1,
            LaunchTime: 1,
            Zone: 1,
            Lifetime: 1,
            LastActiveTime: 1,
            Email: 1,
            VolumeId: 1                    
        }
    }]).exec(function(e, d) {
        if(e) throw e;
        res.send(d);
    });
}

exports.operations = function(req, res){
    var instanceId = req.query.instance;
    console.log('ec2ops: ');
    console.log(instanceId);
    var instance_operations = {},operationPercentage = {},volume_operations={};
    var volumes = [];
    mongoose.model('Billings').find({ResourceId: instanceId}).exec(function(e,d){
        var op;
        for(var i=0 in d){
            op = d[i].toJSON().Operation;
            if(!(op in instance_operations)){
                instance_operations[op] = 1;
            }else{
                instance_operations[op] +=1;
            }
        }
        mongoose.model('ec2Instances').find({
            Id: instanceId,
        }).exec(function(e,d2){
            console.log(d2);
            volumes = d2[0].VolumeId;
            console.log(volumes.length);
            for(var i in volumes){
                // console.log('--->',volumes[i]);
                // mongoose.model('Billings').find({ResourceId: volumes[i]}).exec(function(e,d3){
                //     for(var j=0 in d3){
                //         op = d3[j].toJSON().Operation;
                //         console.log(op);
                //         if(!(op in volume_operations)){
                //             volume_operations[op] = 1;
                //         }else{
                //             volume_operations[op] +=1;
                //         }
                //     }
                // });
            }
        });
        console.log(volumes);
        console.log(instance_operations);
        console.log(volume_operations);
        // for(var i=0 in operations){
        //     operationPercentage[operations[i]]=(operations[i]/operations.length);
        // }
        // console.log(operationPercentage);
        // res.send();
    });
}