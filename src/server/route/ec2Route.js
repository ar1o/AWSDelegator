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
	},{
        $sort: {
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
            Name: 1,
            Group: 1,
            Type: 1,
            LaunchTime: 1,
            Zone: 1,
            Lifetime: 1                 
        }
    },{
        $sort: {
            State: 1
        }
    }]).exec(function(e, d) {
        if(e) throw e;
        res.send(d);
    });
}

exports.operations = function(req, res){
    var instanceId = req.query.instance;
    var iOps = {},iOpPercent = {};
    // var volumes = [],vOps={},vOpPercent={};
    mongoose.model('Billings').find({ResourceId: instanceId}).exec(function(e,d){
        var op;
        for(var i=0 in d){
            op = d[i].toJSON().Operation;
            if(!(op in iOps)){
                iOps[op] = 1;
            }else{
                iOps[op] +=1;
            }
        }
        var iTotal=0,iCount=0;
        // var vTotal=0,vCount=0;
        for(var i in iOps){
            iTotal+=iOps[i];
        }
        for(var i=0 in iOps){
            iOpPercent[i]=(iOps[i]/iTotal);
        }
        res.send(iOpPercent);
        // mongoose.model('ec2Instances').find({
        //     Id: instanceId,
        // }).exec(function(e,d2){
        //     volumes = d2[0].VolumeId;
        //     var index = 0;
        //     var controller = function(){
        //         iterator(function(){
        //             index++;
        //             if(index < volumes.length) controller();
        //             else{
        //                 var iTotal=0,vTotal=0,iCount=0,vCount=0;
        //                 for(var i in iOps){
        //                     iTotal+=iOps[i];
        //                 }

        //                 for(var i=0 in iOps){
        //                     iOpPercent[i]=(iOps[i]/iTotal)*100;
        //                 }

        //                 for(var i in vOps){
        //                     vTotal+=vOps[i];
        //                 }
                        
        //                 for(var i=0 in vOps){
        //                     vOpPercent[i]=(vOps[i]/vTotal)*100;
        //                 }
        //                 res.send();
        //             }
        //         });
        //     };
        //     var iterator = function(_callback){
        //         mongoose.model('Billings').find({ResourceId: volumes[index]}).exec(function(e,d3){
        //             var vol_op = {};
        //             for(var j=0 in d3){
        //                 op = d3[j].toJSON().Operation;
        //                 if(!(op in vol_op)){
        //                     vol_op[op] = 1;
        //                 }else{
        //                     vol_op[op] +=1;
        //                 }
        //             }
        //             vOps[volumes[index]]=vol_op;
        //             _callback();
        //         });
        //     };
        //     controller();
        // });
    });
}
