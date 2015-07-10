mongoose = require('mongoose');
notificationSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	NotificationType: String,
	NotificationData: String,
	Seen: String,
	Time: String
});

mongoose.model('Notifications', notificationSchema, 'notifications');