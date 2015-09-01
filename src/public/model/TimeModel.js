var TimeModel = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		// this.change('metricsDataReady');
	},

	updatedTime: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/time',
			success: function(data) {
				result = data;
			}
		});
	},

	getLatestTime: function(callback) {
		var self = this;
		this.updatedTime().done(function(result) {
			
			self.formatTime(result, function(value) {
				if(callback)
				callback(value);
			});
		}).fail(function() {
			console.log('FAILED');
			callback(null);
		});

	},

	formatTime: function(time,callback) {
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

		var d2 = new Date(time);
		var fullDate = days[d2.getDay()] + ", " + d2.getDate() + " " + months[d2.getMonth()] + " " + 
		d2.getFullYear() + " at " + (d2.getHours()<10?'0':'')+ d2.getHours() + ":" + 
		(d2.getMinutes()<10?'0':'')+ d2.getMinutes() + ":" + (d2.getSeconds()<10?'0':'')+ d2.getSeconds();
		if(callback)
			callback(fullDate);
	}

});