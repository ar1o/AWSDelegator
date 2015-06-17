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
        res.send(d);
    });
}