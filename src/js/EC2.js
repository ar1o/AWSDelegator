    // var http = require('http');

    // function onListenEvent(req, res) {
    //   res.writeHead(200, { 'Content-Type': 'text/html' });
    //   res.end('<h1>hello world</h1>');
    // }

    // var app = http.createServer(onListenEvent);

    // app.listen(4000, 'localhost');

    // console.log('server app running at localhost:4000');


// var test = new AWS();
// console.log(test);

// var AWS = require('aws-sdk');
// AWS.config.update({accessKeyId: 'AKIAIS4FUFGM2FFEVKBQ', secretAccessKey: '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'});
// AWS.config.region = 'us-west-2';
// console.log(AWS);
// var ec2 = new AWS.EC2();
// console.log(ec2);

// var params = {
//   DryRun: true || false,
//   Filters: [
//     {
//       Name: 'STRING_VALUE',
//       Values: [
//         'STRING_VALUE',
//         /* more items */
//       ]
//     },
//     /* more items */
//   ],
//   InstanceIds: [
//     'STRING_VALUE',
//     /* more items */
//   ],
//   MaxResults: 0,
//   NextToken: 'STRING_VALUE'
// };


// ec2.describeInstances(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


var AWS = require('aws-sdk');
console.log(AWS);

var ec2 = new AWS.EC2({
    accessKeyId: "AKIAIS4FUFGM2FFEVKBQ",
    secretAccessKey: "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",
    region: "us-west-2"
});
console.log(ec2);
ec2.describeInstances({}, function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    for (var r in data.Reservations) {
        for (var i in data.Reservations[r].Instances) {
            var instance = data.Reservations[r].Instances[i];
            var state = instance.State.Name;
            console.log(instance.InstanceId + " (" + state + ") " + instance.PublicDnsName);            
        }
    }
});

// ec2.describeInstances({},function(err, data) {
//   // if (err) console.log(err); // an error occurred
//   // else     
//   console.log(data);           // successful response
// });


// var EC2Model = Backbone.Model.extend({

//     initialize: function() {

//     	this.test('a', function(data) {console.log(data) });
			
// 		this.insta(function(data){console.log(data)});
// 	},


// 	insta: function(callback) {
// 		$.getJSON("https://us-west-2.console.aws.amazon.com/ec2/ecb?call=getDistinctResourceAttribute?&mbtc=1086602647&callback=?", function(d){callback(d)} );
// 	},

// 	test: function(query, callback) {
// 		console.log("tst");
// 		$.getJSON("http://clients1.google.com/complete/search?client=youtube&hl=en&gl=ca&gs_rn=23&gs_ri=youtube&tok=F42eWOexTnNoMJGCB0cJkw&ds=yt&cp=1&gs_id=b&q=d&callback=?", function(d){callback(d)} );
// 	}

    
// });



// module.exports = AWS;