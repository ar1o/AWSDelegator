//Express middlewares which process the incoming requests before handling them down to the routes

// create an express app
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';

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

  // GET information on EC2 instances. Returns JSON.
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


var params = null;

app.get('/test2', function(req, res) {

var cloudwatch = new AWS.CloudWatch();
cloudwatch.getMetricStatistics(params, function(err, data) {
  // if (err) console.log(err, err.stack); // an error occurred
  // else     console.log(data);           // successful response
  console.log(data);  
  res.send(data);
});
    
});

app.listen(port);

console.log('server started on port %s', port);

