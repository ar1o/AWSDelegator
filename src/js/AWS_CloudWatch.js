var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: 'AKIAJIJSGQBVN7WNURTA', secretAccessKey: '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'});
AWS.config.region = 'us-west-2';



var cloudwatch = new AWS.CloudWatch();
console.log(cloudwatch);

var params = {
  Dimensions: [
    {
      Name: 'InstanceId' /* required */
    },
    /* more items */
  ],
  MetricName: 'CPUUtilization'
};
cloudwatch.listMetrics(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(JSON.stringify(data.Metrics));           // successful response
});

// console.log(data[);


var params = {
  EndTime: 1431026722, /* required */
  MetricName: 'CPUUtilization', /* required */
  Namespace: 'AWS/EC2', /* required */
  Period: 3600, /* required */
  StartTime: '2015-05-07T18:03:08.000Z', /* required */
  Statistics: ['Average'],
  Dimensions: [
    {
      Name: 'InstanceId', /* required */
      Value: 'i-448c57b3' /* required */
    },
    /* more items */
  ],
  Unit: 'Percent'
};
cloudwatch.getMetricStatistics(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});