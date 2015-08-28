budgetSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	BudgetName: String,
	BatchType: String,
	BatchName: String,
	StartDate: String,
	EndDate: String,
	Amount: Number,
	timeout: String,
	State: String
});

mongoose.model('Budgets', budgetSchema, 'budgets');