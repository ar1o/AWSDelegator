exports.parseGroups = function(callback){
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		mongoose.model('iamGroups').find().exec(function(err, dbGroups) {
			if (err) throw err;
			var iam = new AWS.IAM();
			var newGroups = 0;
			iam.listGroups({}, function(err, iamGroups) {
				if (err) throw err;
				checkGroupConsistency(iamGroups, dbGroups,function(){
					var index1 = 0;
					var controller1 = function() {
						iterator1(function() {
							index1++;
							if (index1 < iamGroups.Groups.length) { 
								controller1();
							} else {
								if(newGroups!=0)
									console.log('ParseAlert(iam): found '+newGroups+' new group/s');
								callback();
							}
						});
					};
					var iterator1 = function(callback1) {
						if (isNewGroup(iamGroups.Groups[index1], dbGroups)) {
							var doc = {
								Path: iamGroups.Groups[index1].Path,
								GroupName: iamGroups.Groups[index1].GroupName,
								GroupId: iamGroups.Groups[index1].GroupId,
								Arn: iamGroups.Groups[index1].Arn,
								CreateDate: iamGroups.Groups[index1].CreateDate
							};
							newGroups += 1;
							db.collection('iamGroups').insert(doc,function(e){
								if(e) throw e;
								callback1();
							});
						}else{
							callback1();
						}
					};
					controller1();	
				});
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
				checkUserConsistency(iamUsers, dbUsers,function(){
					var index1 = 0;
					var controller1 = function() {
						iterator1(function() {
							index1++;
							if (index1 < iamUsers.Users.length) { 
								controller1();
							} else {
								if(newUsers!=0)
									console.log('ParseAlert(iam): found '+newUsers+' new user/s');
								callback();
							}
						});
					};
					var iterator1 = function(callback1) {
						if (isNewUser(iamUsers.Users[index1], dbUsers)) {
							var doc = {
								Path: iamUsers.Users[index1].Path,
								UserName: iamUsers.Users[index1].UserName,
								UserId: iamUsers.Users[index1].UserId,
								Arn: iamUsers.Users[index1].Arn,
								CreateDate: iamUsers.Users[index1].CreateDate
							};
							newUsers += 1;
							db.collection('iamUsers').insert(doc,function(e){
								if(e) throw e;
								callback1();
							});
						}else{
							callback1();
						}
					};
					controller1();					
				});
			});
		});
	});
}

exports.parseUserGroups = function(callback){
	mongoose.model('iamUsersGroups').aggregate([{
		$project: {
			_id: 0,
			UserGroup: 1
		}
	}]).exec(function(e, usersGroups) {
		if (e) throw e;
		var	user_group = [];
		for (var i=0 in usersGroups) {			
			user_group.push(usersGroups[i].UserGroup);			
		}		
		mongoose.model('iamUsers').find().exec(function(err, dbUsers) {
			if (err) throw err;
			var index1 = 0;
			var active_user_group = [];
			var controller1 = function() {
				iterator1(function() {
					index1++;
					if (index1 < dbUsers.length) controller1();
					else {
						var index3 = 0;						
						var controller3 = function() {
							iterator3(function() {
								index3++;
								if (index3 < user_group.length) controller3();
								else {
									addNewUserGroups(active_user_group, function(){										
										callback();
									});									
								}
							});
						};
						var iterator3 = function(callback3) {
							if (active_user_group.indexOf(user_group[index3])==-1) {								
								mongoose.model('iamUsersGroups').remove({
									UserGroup: user_group[index3]
								}).exec(function(e) {
									if (e) throw e;									
									callback3();
								});
							} else {
								callback3();
							}
						};
						if(user_group.length!=0){
							controller3();
						}else{
							addNewUserGroups(active_user_group, function(){
								callback();
							});
						}
					}
				});
			};
			var iterator1 = function(callback1) {
				var iam = new AWS.IAM();
				var params = {
					UserName: dbUsers[index1].UserName
				};
				iam.listGroupsForUser(params, function(err, data) {
					if (err) throw err;
					var index2 = 0;
					var controller2 = function() {
						iterator2(function() {
							index2++;
							if (index2 < data.Groups.length) controller2();
							else {
								callback1();
							}
						});
					};
					var iterator2 = function(callback2) {
						active_user_group.push(params.UserName + "_" + data.Groups[index2].GroupName);
						callback2();
					};
					if (data.Groups.length != 0){
						controller2();
					}else{
						callback1();
					}

				});
			};
			controller1();
		});
	});
}

var addNewUserGroups = function(active_user_group,callback){	
	var index1 = 0;
	var controller1 = function() {
		iterator1(function() {
			index1++;
			if (index1 < active_user_group.length) {
				controller1();
			} else {				
				callback();
			}
		});
	};
	var iterator1 = function(callback1) {
		var names = active_user_group[index1].split('_');
		var doc = {
			UserGroup: active_user_group[index1],
			UserName: names[0],
			GroupName: names[1]
		}
		mongoose.model('iamUsersGroups').update({
			UserGroup: active_user_group[index1],
		}, doc, {
			upsert: true
		}, function(e) {
			if (e) throw e;
			callback1();
		});
	};
	controller1();
}

var checkGroupConsistency = function(iamGroups,dbGroups,callback){
    var activeGroups = [];    
    for(var i in iamGroups.Groups)
        activeGroups.push(iamGroups.Groups[i].GroupName);
    var index1 = 0, oldUsers = 0;
	var controller1 = function() {
		iterator1(function() {
			index1++;
			if (index1 < dbGroups.length) controller1();
			else {
				if(oldUsers!=0)
					console.log('ParseAlert(iam): removed '+oldUsers+' group/s');
				callback();
			}
		});
	};
	var iterator1 = function(callback1) {
		if(activeGroups.indexOf(dbGroups[index1].GroupName)==-1){
            mongoose.model('iamGroups').remove({
                GroupName: dbGroups[index1].GroupName
            }).exec(function(e){
                if(e) throw e;
                mongoose.model('iamUsersGroups').remove({
	            	GroupName: dbGroups[index1].GroupName
	            }).exec(function(e){
	            	if(e) throw e;
	            	oldUsers+=1;
	            	callback1();
	            });
            });
        }else{
        	callback1();
        }
	};
	if(dbGroups.length != 0){
		controller1();
	}else{
		callback();
	}
}

var checkUserConsistency = function(iamUsers,dbUsers,callback){
    var activeUsers = [];
    for(var i in iamUsers.Users)
        activeUsers.push(iamUsers.Users[i].UserName);
    var index1 = 0, oldUsers = 0;
	var controller1 = function() {
		iterator1(function() {
			index1++;
			if (index1 < dbUsers.length) controller1();
			else {
				if(oldUsers!=0)
					console.log('ParseAlert(iam): removed '+oldUsers+' user/s');
				callback();
			}
		});
	};
	var iterator1 = function(callback1) {
		if(activeUsers.indexOf(dbUsers[index1].UserName)==-1){
            mongoose.model('iamUsers').remove({
                UserName: dbUsers[index1].UserName
            }).exec(function(e){
                if(e) throw e;
                mongoose.model('iamUsersGroups').remove({
	            	UserName: dbUsers[index1].UserName
	            }).exec(function(e){
	            	if(e) throw e;
	            	oldUsers+=1;
	            	callback1();
	            });
            });
        }else{
        	callback1();
        }
	};
	if(dbUsers.length != 0){
		controller1();
	}else{
		callback();
	}
}

var isNewGroup = function(group,dbGroups){
    for(var i in dbGroups)
        if(dbGroups[i].GroupName == group.GroupName)
            return false;
    return true;
}

var isNewUser = function(user,dbUsers){
    for(var i in dbUsers){
        if(dbUsers[i].UserName == user.UserName)
            return false;
    }
    return true;
}