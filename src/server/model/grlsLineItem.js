grlsLineItemsSchema = new mongoose.Schema({
	instanceId: String,
	user: String,
	group: String,
	serviceType: String,
	decayTime: Number,
	time: String
});

mongoose.model('grlsLineItems', grlsLineItemsSchema, 'grlsLineItems');