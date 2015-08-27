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
        // console.log('notifications', d);
        res.send(d);
    });
}

exports.updateNotifications = function(req, res) {
    var notificationName = req.query.notificationName;
    // console.log('notificationName', notificationName);

    var conditions = {
        NotificationData: notificationName
    };
    var update = {
        // $set: {
            Seen: 'true'
        // }
    };
    var options = {
        multi: true
    };

    mongoose.model('Notifications').update(conditions, update, options,callback);

    function callback(err, numAffected) {
        console.log(err);
        console.log(numAffected)
       
    };
     res.send('Notification changed');

}
