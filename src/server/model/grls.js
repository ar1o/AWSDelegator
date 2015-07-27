grlsInstanceSchema = new mongoose.Schema({
	timeBudgetName: String,
	instanceId: String,
	instanceType: String,
	user: String,
	group: String,
	instanceRegion: String,
	serviceType: String,
	//ec2 t2 instance type
	instanceType: String,
	//rds min,max allowed connections
	minConnectionsLimit: Number,
	maxConnectionsLimit: Number,
	lifetime: Number,
	//under profile decay coefficient
	uDecay: Number,
	//over profile decay coefficient
	oDecay: Number,
	state: String
});

mongoose.model('grlsInstances', grlsInstanceSchema, 'grlsInstances');