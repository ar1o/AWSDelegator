iamGroupsSchema = new mongoose.Schema({
    Path: String,
    GroupName: String,
    GroupId: String,
    Arn: String,
    CreateDate: String
});

iamUsersSchema = new mongoose.Schema({
    Path: String,
    UserName: String,
    UserId: String,
    Arn: String,
    CreateDate: String
});

iamUsersGroupsSchema = new mongoose.Schema({
    UserGroup: String,
    GroupName: String,
    UserName: String
});

mongoose.model('iamGroups', iamGroupsSchema, 'iamGroups');
mongoose.model('iamUsers', iamUsersSchema, 'iamUsers');
mongoose.model('iamUsersGroups', iamUsersGroupsSchema, 'iamUsersGroups');