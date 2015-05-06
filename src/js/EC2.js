// create an express app

var AWS = require('aws-sdk');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// route handler for GET /
app.get('/test', function(req, res) {
    
     // console.log(AWS);
var ec2 = new AWS.EC2({
    accessKeyId: "asdas",
    secretAccessKey: "asdadas",
    region: "us-west-2"
});

	ec2.describeInstances({}, function(err, data) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
    var finaldata = data;

    // for (var r in data.Reservations) {
    //     for (var i in data.Reservations[r].Instances) {
    //         var instance = data.Reservations[r].Instances[i];
    //         var state = instance.State.Name;
    //         console.log(instance.InstanceId + " (" + state + ") " + instance.PublicDnsName);            
    //     }
    // }
    res.send(finaldata);

	});
	//
  });

app.listen(port);

console.log('server started on port %s', port);

