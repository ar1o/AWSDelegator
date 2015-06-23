pricingSchema = new Schema({
	ProductName: {
		type: String
	},
	// (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name']);
	OS: {
		type: String,
		default: null
	},
	// (pricingJSON.config.regions[region]['region']);
	Region: {
		type: String,
		required: true
	},
	TierName: {
		type: String
	},
	InstanceSize: {
		type: String
	},
	//(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size]['size'])
	TypeName: {
		type: String,
		required: true
	},
	//(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].prices.USD);
	Price: {
		type: Number,
		required: true
	},
	//Date field added for insert reference 
	DateModified: {
		type: Date,
		default: Date()
	},
	StorageType: {
		type: String
	}
});

mongoose.model('pricingModel', pricingSchema, 'pricing');