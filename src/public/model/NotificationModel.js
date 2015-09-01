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
		// console.log('checking for notifications');
		var self = this;
		this.notification_result().done(function(result) {
			notificationCollection.reset();
			// console.log(result);
			for (var r in result) {
				var data = new NotificationViewModel({
					notification: result[r].NotificationData,
					notificationType: result[r].NotificationType,
					seen: result[r].Seen,
					time: result[r].Time
				});
				notificationCollection.add(data, {
					at: 0
				});
			}
			// remove the last element if it's > 25 and already seen
			if (notificationCollection.length > 25 &&
				notificationCollection.at(notificationCollection.length - 1).get('seen') == 'true') {
					notificationCollection.pop();
			}
			self.set('dataReady', Date.now());
		}).fail(function() {
			console.log('FAILED');
		});
	},
	// Get the number of notifications that have no been seen yet. 
	getSeenNumber: function() {
		var numSeen = 0;
		for (var i = 0; i < notificationCollection.length; i++) {
			if (notificationCollection.at(i).get('seen') == "false") {
				numSeen++;
			}
		}
		return numSeen;
	},
	//Sets the notification as seen in the database when clicked. 
	setAsSeen: function(Id) {
		var self = this;
		var params = {
			notificationName: Id
		};
		(function(params) {
			$.get(host + '/api/notifications/seen', params, function(result) {
				// console.log('resut', result);
				self.getNotification();
				// self.set('dataReady', Date.now());
			});
		})(params);
	},
	//Check by ID if a particular budget is seen. 
	isSeen: function(Id) {
		for (var i = 0; i < notificationCollection.length; i++) {
			if (notificationCollection.at(i).get('notification') == Id) {
				if (notificationCollection.at(i).get('seen') == 'false') {
					return false;
				} else {
					return true;
				}
			}
		}
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