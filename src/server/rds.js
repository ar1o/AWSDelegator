AWS = require('aws-sdk');
var currentDate = new Date();
var currentTime = currentDate.getTime();
var currentTimeIso = new Date(currentTime).toISOString();
AWS.config.credentials = new AWS.SharedIniFileCredentials({
	profile: 'dev2'
});
var currentDate = new Date();
            var currentTime = currentDate.getTime();
            var currentTimeIso = new Date(currentTime).toISOString(); 
var params = {
	EndTime: currentTimeIso,
	MetricName: 'BinLogDiskUsage',
	Namespace: 'AWS/RDS',
	Period: 3600,
	StartTime: new Date(currentTime - 3600 * 1000).toISOString(),
	Statistics: ['Average'],
	Dimensions: [{
		Name: 'DBInstanceIdentifier',
		Value: 'msmit'
	}],
	Unit: 'Bytes'
};
AWS.config.region = 'us-east-1';
var cloudwatch = new AWS.CloudWatch();
cloudwatch.getMetricStatistics(params, function(err, data) {
	if (err) throw err;
	console.log(data);
	console.log(currentDate);
});
// AWS.config.region = 'us-east-1';
// var rds = new AWS.RDS();
// rds.describeDBInstances({}, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else {    
//   	// console.log(data);           // successful response
//   	console.log(data.DBInstances[0])
//   }
// });