billingSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	ProductName: String,
	Cost: Number,
	ResourceId: String,
	UsageStartDate: {type: String, index: true},
	"user:Group": {type: String, index: true},
	"user:Name": {type: String, index: true},
	Rate: Number,
	UsageType: String,
	ItemDescription: String,
	UsageQuantity: Number,
	RateId: Number,
	NonFreeRate: Number,
	NonFreeCost: Number

});

mongoose.model('Billings', billingSchema, 'lineItems');