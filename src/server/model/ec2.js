ec2InstanceSchema = new mongoose.Schema({
    Id: String,
    State: String,
    ImageId: String,
    KeyName: String,
    Type: String,
    LaunchTime: String,
    Zone: String,
    Lifetime: Number,
    LastActiveTime: String,
    Email: String,
    VolumeId: Array
});

ec2MetricsSchema = new mongoose.Schema({
    InstanceId: String,
    NetworkIn: Number,
    NetworkOut: Number,
    CPUUtilization: Number,
    Time: String
});

mongoose.model('ec2Metrics', ec2MetricsSchema, 'ec2Metrics');
mongoose.model('ec2Instances', ec2InstanceSchema, 'ec2Instances');