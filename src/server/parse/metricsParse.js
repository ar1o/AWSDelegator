var MongoClient = require('mongodb').MongoClient;
var iteratorIndex = 0;

exports.parseMetrics = function(masterCallback) {
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		mongoose.model('Instances').find({
			State: 'running',
		}).exec(function(err, runningInstances) {
			iteratorIndex = 0;
			var currentDate = new Date();
			var currentTime = currentDate.getTime();
			var currentTimeIso = new Date(currentTime).toISOString();			

			var params = {
				EndTime: 0,
				MetricName: '',
				Namespace: 'AWS/EC2',
				Period: 3600,
				StartTime: 0,
				Statistics: ['Average'],
				Dimensions: [{
					Name: 'InstanceId',
					Value: ''
				}, ],
				Unit: 'Percent'
			};
			var controller = function(arr) {
				iterator(arr[iteratorIndex], function() {
					iteratorIndex++;
					if (iteratorIndex < arr.length) controller(arr);
					else masterCallback();
				});
			}
			var iterator = function(instance, callback) {
				var instanceRegion = runningInstances[iteratorIndex].Zone;
				console.log(runningInstances[iteratorIndex].VolumeId);
				AWS.config.region = instanceRegion.substring(0,instanceRegion.length-1);
				var cloudwatch = new AWS.CloudWatch();
				var doc = {
					InstanceId: runningInstances[iteratorIndex].Id,
					NetworkIn: 0,
					NetworkOut: 0,
					CPUUtilization: 0,
					Time: currentTimeIso
				};
				params.Dimensions[0].Value = doc.InstanceId;
				params.StartTime = new Date(currentTime-3600*1000).toISOString();
				params.EndTime = currentTimeIso;				
				params.MetricName = 'NetworkIn';
				params.Unit = 'Bytes';				
				cloudwatch.getMetricStatistics(params, function(err, data) {
					if(err) throw err;
					console.log(data.Datapoints[0].Average);
					doc.NetworkIn = data.Datapoints[0].Average;
					params.MetricName = 'NetworkOut'
					cloudwatch.getMetricStatistics(params, function(err, data) {
						doc.NetworkOut = data.Datapoints[0].Average;
						params.MetricName = 'CPUUtilization';
						params.Unit = 'Percent';
						cloudwatch.getMetricStatistics(params, function(err, data) {
							doc.CPUUtilization = data.Datapoints[0].Average;
							db.collection('ec2metrics').insert(doc);							
							callback();
						});
					});
				});
			}			
			if (runningInstances.length != 0) {
				controller(runningInstances);
			} else {
				masterCallback();
			}
		});
	});
}