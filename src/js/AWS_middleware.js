//Express middlewares which process the incoming requests before handling them down to the routes

// create an express app
var AWS = require('aws-sdk');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(require('./CORS'));

// route handler for GET /
app.get('/test', function(req, res) {
    
     // console.log(AWS);
var ec2 = new AWS.EC2({
    region: "us-west-2"
});

	ec2.describeInstances({}, function(err, data) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
    var finaldata = data;
    res.send(finaldata);

	});
    
});

app.listen(port);

console.log('server started on port %s', port);

