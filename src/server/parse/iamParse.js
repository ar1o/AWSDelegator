exports.parseGroups = function(callback){
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		mongoose.model('iamGroups').find().exec(function(err, dbGroups) {
			if (err) throw err;
			var iam = new AWS.IAM();
			var newGroups = 0;
			iam.listGroups({}, function(err, iamGroups) {
				if (err) throw err;
				checkGroupConsistency(iamGroups, dbGroups);
				for (var group=0 in iamGroups.Groups) {
					// console.log("PATH",iamGroups.Groups[0]);ß
					if (isNewEntry(group, dbGroups)) {
						var doc = {
							Path: iamGroups.Groups[group].Path,
							GroupName: iamGroups.Groups[group].GroupName,
							GroupId: iamGroups.Groups[group].GroupId,
							Arn: iamGroups.Groups[group].Arn,
							CreateDate: iamGroups.Groups[group].CreateDate,
							Credits: 0
						};
						newGroups+=1;
						db.collection('iamGroups').insert(doc);
					}
				}
				console.log('ParseAlert(iam): found '+newGroups+' new groups');
				callback();
			});
		});
	});
}

exports.parseUsers = function(callback){
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		mongoose.model('iamUsers').find().exec(function(err, dbUsers) {
			if (err) throw err;
			var iam = new AWS.IAM();
			var newUsers = 0;
			iam.listUsers({}, function(err, iamUsers) {
				if (err) throw err;
				checkUserConsistency(iamUsers, dbUsers);
				for (var user=0 in iamUsers.Users) {
					if (isNewEntry(user, dbUsers)) {
						var doc = {
							Path: iamUsers.Users[user].Path,
							UserName: iamUsers.Users[user].UserName,
							UserId: iamUsers.Users[user].UserId,
							Arn: iamUsers.Users[user].Arn,
							CreateDate: iamUsers.Users[user].CreateDate,
							Credits: 0
						};
						newUsers+=1;
						db.collection('iamUsers').insert(doc);
					}
				}
				console.log('ParseAlert(iam): found '+newUsers+' new users');
				callback();
			});
		});
	});
}

var checkGroupConsistency = function(iamGroups,dbGroups){
    var activeGroups = [];    
    for(var i in iamGroups.Groups)
        activeGroups.push(iamGroups.Groups[i].GroupId);
    for(var i in dbGroups){
        if(!(i.GroupId in activeGroups)){
            mongoose.model('iamGroups').remove({
                _id: i._id
            }).exec(function(e){
                if(e) throw e;
            });
        }
    }
}

var checkUserConsistency = function(iamUsers,dbUsers){
    var activeUsers = [];
    for(var i in iamUsers.Users)
        activeUsers.push(iamUsers.Users[i].UserId);
    for(var i in dbUsers){
        if(!(i.GroupId in activeUsers)){
            mongoose.model('iamUsers').remove({
                _id: i._id
            }).exec(function(e){
                if(e) throw e;
            });
        }
    }
}

var isNewEntry = function(group,dbGroups){
    for(var i in dbGroups)
        if(i.GroupId == group.GroupId)
            return false;
    return true;
}