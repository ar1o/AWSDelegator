exports.metrics = function(req, res) {
	var instanceId = req.query.instance;
	mongoose.model('rdsMetrics').aggregate([{
		$match: {
			DBInstanceIdentifier:{
				$eq: instanceId
			}
		}
	}]).exec(function(e, d) {
		res.send(d);
	});
}

exports.instances = function(req, res) {
	mongoose.model('rdsInstances').aggregate([{
		$project: {
			_id: 0,
			DBInstanceIdentifier: 1,
			DBInstanceClass: 1,
			Engine: 1,
			DBInstanceStatus: 1,
			MasterUsername: 1,
			DBName: 1,
			Endpoint: 1,
			AllocatedStorage: 1,
			InstanceCreateTime: 1,
			AvailabilityZone: 1,
			MultiAZ: 1,
			StorageType: 1
		}
	}]).exec(function(e, d) {
		if (e) throw e;
		res.send(d);
	});
}

exports.operations = function(req, res){
    var instanceId = req.query.instance;
    var iOps = {},iOpPercent = {};
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
        for(var i in iOps){
            iTotal+=iOps[i];
        }
        for(var i=0 in iOps){
            iOpPercent[i]=(iOps[i]/iTotal);
        }
        res.send(iOpPercent);
    });
}