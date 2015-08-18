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
	minDB: Number,
	maxDB: Number,
	timeout: String,
	State: Boolean
});

mongoose.model('timeBudgets', timeBudgetSchema, 'timeBudgets');