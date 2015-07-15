exports.notifications = function(req, res) {
    mongoose.model('Notifications').aggregate([{
        $project: {
            _id: 0,
            NotificationType: 1,
            NotificationData: 1,
            Seen: 1,
            Time: 1
        }
    }]).exec(function(e, d) {
        console.log('notifications', d);
        res.send(d);
    });
}