exports.groups = function(req, res) {
	mongoose.model('iamGroups').aggregate([{
        $project: {
            _id:0,
            GroupName: 1,
            GroupId: 1,
            Arn: 1,
            CreateDate: 1,
            Amount: 1
        }
    }]).exec(function(e, d) {
        if(e) throw e;
        res.send(d);
    });
}

exports.users = function(req, res) {
    mongoose.model('iamUsers').aggregate([{
        $project: {
            _id:0,
            UserName: 1,
            UserId: 1,
            Arn: 1,
            CreateDate: 1,
            Amount: 1
        }
    }]).exec(function(e, d) {
        if(e) throw e;
        res.send(d);
    });
}