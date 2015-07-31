

var ConfigurationModel = Backbone.Model.extend({
	defaults: {
		openConfig: false
	},

	initialize: function() {
		var data = {};
		var result;
		this.change('openConfig');
		this.getConfiguration();
		this.change('balanceDataReady');
		this.change('UsedCreditsDataReady');
	},
	configuration_result: function() {
		result = '';
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/getConfiguration',
			success: function(data) {
				result = data;
			}

		});
	},
	getConfiguration: function() {
		var self = this;
		ConfigurationCollection.reset();
		this.configuration_result().done(function(result) {
			// console.log('result',result)
			for (var r in result) {
				var data = new ConfigurationViewModel({
					number: result["account"][0]["Number"],
					balance : result["account"][0]["Balance"],
					s3 : result["account"][0]["S3BucketRegion"],
					regions : result["account"][0]["Regions"],
					bucketName : result["account"][0]["S3BucketName"],
					URL : result["account"][0]["DB_URL"],
					balanceExp : result["account"][0]["BalanceExp"],
					creditsUsed : result["account"][0]["creditsUsed"]
				});
				ConfigurationCollection.add(data);
			}
			self.set('openConfig', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},
	setBalance: function(data) {
		console.log('ConfigurationView/setBalance',data);
		var self = this;
		return $.ajax({
			type: 'POST',
			url: 'http://localhost:3000/setBalance',
			data: {"balance" : data},
			success: function(data) {
				self.set('balanceDataReady', Date.now());
			},
			error: function(data){
				// console.log(data);
			}
		});
	},
	setCreditsUsed: function(data) {
		console.log('ConfigurationView/setCreditsUsed',data); //not added to app.js
		var self = this;
		return $.ajax({
			type: 'POST',
			url: 'http://localhost:3000/setCreditsUsed',
			data: {"used" : data},
			success: function(data) {
				self.set('UsedCreditsDataReady', Date.now());
			},
			error: function(data){
				// console.log(data);
			}
		});
	},
	setExpiration: function(data) {
		console.log('ConfigurationView /setExpiration',data);
		var self = this;
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/setExpiration',
			data: {"expiration" : data},
			success: function(data) {
				self.set('expirationDataReady', Date.now());
			},
			error: function(data){
				// console.log(data);
			}
		});
	}
});

var ConfigurationViewModel = Backbone.Model.extend({
	defaults: {
		account: null,
		balance : 0,
		s3 : null,
		regions : null,
		bucketName : null,
		URL: null,
		balanceExp: null
	}

});


var ConfigurationViewCollection = Backbone.Collection.extend({
	model: ConfigurationViewModel,
	initialize: function() {
		this.on('add', function(model) {
			// console.log('someting got added', model);
		});
	}
});


var ConfigurationCollection = new ConfigurationViewCollection();
