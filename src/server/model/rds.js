rdsInstanceSchema = new mongoose.Schema({
	DBInstanceIdentifier: String,
	DBInstanceClass: String,
	Engine: String,
	DBInstanceStatus: String,
	MasterUsername: String,
	DBName: String,
	Endpoint: String,
	AllocatedStorage: Number,
	InstanceCreateTime: String,
	AvailabilityZone: String,
	MultiAZ: String,
	StorageType: String
});

rdsMetricsSchema = new mongoose.Schema({
	DBInstanceIdentifier: String,
	CPUUtilization: Number,
	DatabaseConnections: Number,
	DiskQueueDepth: Number,
	ReadIOPS: Number,
	WriteIOPS: Number,
	Time: String
});

mongoose.model('rdsInstances', rdsInstanceSchema, 'rdsInstances');
mongoose.model('rdsMetrics', rdsMetricsSchema, 'rdsMetrics');