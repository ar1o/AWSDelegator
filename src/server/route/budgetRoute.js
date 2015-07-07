exports.budgets = function(req, res) {
	mongoose.model('Budgets').aggregate([{
		$project: {
			_id: 0,
			BudgetName: 1,
			BatchType: 1,
			BatchName: 1,
			StartDate: 1,
			EndDate: 1,
			Amount: 1
		}
	}]).exec(function(e, d) {
		res.send(d);
	});
}