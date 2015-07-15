var NotificationModel = Backbone.Model.extend({
	defaults: {
		isOpen: false
	},

	initialize: function() {
		this.change('isOpen');
		this.change('dataReady');
		
	},
	notification_result: function() {
		var self = this;
		return $.ajax({
			type: 'GET',
			data: self.data,
			contentType: 'plain/text',
			url: host + '/api/notifications',
			success: function(data) {
				result = data;
			}
		});
	},
	getNotification: function() {
		var self = this;
		InstanceCollection.reset();
		this.notification_result().done(function(result) {
			// console.log(result);
			for (var r in result) {
				var data = new NotificationViewModel({
					notification: result[r].NotificationData,
					notificationType: result[r].NotificationType,
					seen: result[r].Seen,
					time: result[r].Time
				});
				notificationCollection.add(data);
				// console.log(notificationCollection.pluck('Notification'));
			}
			self.set('dataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},

	getSeenNumber: function() {
		var numSeen = 0;
		for (var i=0; i< notificationCollection.length; i++) {
			if(notificationCollection.at(i).get('seen') == "false") {
				numSeen++;
			}
		}
		return numSeen;
	}

});


var NotificationViewModel = Backbone.Model.extend({});

var NotificationViewCollection = Backbone.Collection.extend({
	model: NavViewModel,
	initialize: function() {
		this.on('add', function(model) {
			// console.log('someting got added');
		});
	}
});

var notificationCollection = new NotificationViewCollection();
// var notify1 = new NotificationViewModel({
// 	title: 'Alert1'
// });
// var notify2 = new NotificationViewModel({
// 	title: 'Alert2'
// });
// var notify3 = new NotificationViewModel({
// 	title: 'Alert3'
// });
// var notify4 = new NotificationViewModel({
// 	title: 'Alert4'
// });
// var notify = [notify1, notify2, notify3, notify4];

