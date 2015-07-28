timeBudgetSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	TimeBudgetName: String,
	BatchType: String,
	BatchName: String,
	StartDate: String,
	EndDate: String,
	TimeAmount: Number,
	uDecayRate: Number,
	oDecayRate: Number,
	minDBConnections: Number,
	maxDBConnections: Number,
	TimeOut: String,
	State: String
});

mongoose.model('timeBudgets', timeBudgetSchema, 'timeBudgets');