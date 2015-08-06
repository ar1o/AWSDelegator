billingSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	ProductName: String,
	Cost: Number,
	ResourceId: String,
	UsageStartDate: String,
	"user:Group": {type: String},
	"user:Name": {type: String},
	Rate: Number,
	UsageType: String,
	ItemDescription: String,
	UsageQuantity: Number,
	RateId: Number,
	NonFreeRate: Number,
	NonFreeCost: Number

});

mongoose.model('Billings', billingSchema, 'lineItems');