module.exports = function(req,res){
    mongoose.model('Instances').aggregate([{
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
        // console.log(d);
        res.send(d);
    });
}

exports.getOperationPercentage = function(instancesId, res){
    var operations = {},operationPercentage = {};
    mongoose.model('Billings').find({Id: instancesId}).exec(function(e,d){
        for(var i=0 in d){
            if(operations.indexOf(d.Operation)==-1){
                operations[d.Operation] = 1;
            }else{
                operations[d.Operation] +=1;
            }
        }
        for(var i=0 in operations){
            operationPercentage[operations[i]]=(operations[i]/operations.length);
        }
        res.send(operationPercentage);
    });
}