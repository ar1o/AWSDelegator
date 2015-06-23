latestSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	time: String
});

mongoose.model('currentBillingCollection', latestSchema, 'latest');