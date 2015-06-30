usageMeterSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	time: String
});

mongoose.model('usageMeter', usageMeterSchema, 'usageMeter');