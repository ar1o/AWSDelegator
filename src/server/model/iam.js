iamGroupsSchema = new mongoose.Schema({
    Path: String,
    GroupName: String,
    GroupId: String,
    Arn: String,
    CreateDate: String,
    Amount: Number
});

iamUsersSchema = new mongoose.Schema({
    Path: String,
    UserName: String,
    UserId: String,
    Arn: String,
    CreateDate: String,
    Amount: Number
});
mongoose.model('iamGroups', iamGroupsSchema, 'iamGroups');
mongoose.model('iamUsers', iamUsersSchema, 'iamUsers');