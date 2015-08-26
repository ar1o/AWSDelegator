var MeterModel = Backbone.Model.extend({
	initialize: function() {
		var data = {};
		var result;
		this.change('rateDataReady');
		this.change('usageDataReady');
		this.change('balanceDataReady');
	},
	usage_rate_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/meter/rate',
			success: function(data) {
				result = data;
			}
		});
	},
	usage_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/meter/usage',
			success: function(data) {
				result = data;
			}
		});
	},
	usage_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/meter/usage',
			success: function(data) {
				result = data;
			}
		});
	},
	usage_result_total: function () { 
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/meter/usageTotal',
			success: function(data) {
				result = Number(data);
			}
		});
	},
	credit_balance_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/meter/balance',
			success: function(data) {
				result = data;
			}
		});
	},
	getUsageRate: function() {
		var self = this;
		usageRateCollection.reset();
		this.usage_rate_result().done(function(result) {
			var data = new meterModel({
				metric : 'rate',
				value : result[0].total.toFixed(2),
				duration : result[0]._id
			});
			usageRateCollection.add(data);
			self.set('rateDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},
	getUsage: function() {
		var self = this;
		usageCollection.reset();
		this.usage_result().done(function(result) {
			var data = new meterModel({
				metric : 'usage',
				value : result.total.toFixed(2),
				duration : result.time
			});
			usageCollection.add(data);			
			self.set('usageDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},
	getUsageTotal: function() {
		var self = this;
		usageCollection.reset();
		this.usage_result_total().done(function(result) {
			var data = new meterModel({
				metric : 'usage',
				value : result,
				duration : result.time
			});
			usageCollection.add(data);			
			self.set('usageDataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},
	getCreditBalance: function() {
		var self = this;
		creditBalanceCollection.reset();
		this.credit_balance_result().done(function(result) {
			var data = new meterModel({
				metric : 'balance',
				value : result,
			});
			creditBalanceCollection.add(data);			
		}).fail(function() {
			console.log('FAILED');
		});
	},
	getMeterValues: function(){
		this.getUsageRate();
		this.getUsageTotal();
		this.getCreditBalance();
	},
	setCreditBalance: function(balance) {

	},
	setUsage: function(used) {

	},
	getBalance: function(){

	},
	getUse: function() {

	}
});

var meterModel = Backbone.Model.extend({
	defaults: {
		metric: null,
		value: null,
		duration: null
	}
});

var MeterCollection = Backbone.Collection.extend({
	model: meterModel,
	initialize: function() {
		// This will be called when an item is added. pushed or unshifted
		this.on('add', function(model) {});
	}
});

usageRateCollection = new MeterCollection();
usageCollection = new MeterCollection();
creditBalanceCollection = new MeterCollection();