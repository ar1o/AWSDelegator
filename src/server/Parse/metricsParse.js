var MongoClient = require('mongodb').MongoClient;
var databaseUrl = 'mongodb://localhost:27017/awsdb';
var iteratorIndex = 0;
exports.parseMetrics = function(masterCallback, res){
	MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
		mongoose.model('Instances').find({
	        State: 'running',	        
	    }).exec(function(err, runningInstances) {
	    	iteratorIndex=0;
	    	var currentDate = new Date();
    		var currentTime = currentDate.getTime();
    		var currentTimeIso = new Date(currentTime).toISOString(); 
    		var cloudwatch = new AWS.CloudWatch();    
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
			        },
			    ],
			    Unit: 'Percent'
			};	    	
	    	iterate = function(instance,callback){
	    		// console.log("in iterate");	
	    		var doc = {
	    			InstanceId: runningInstances[iteratorIndex].Id,
	    			NetworkIn: 0,
			        NetworkOut: 0,
			        CPUUtilization:0,
			        Time: currentTimeIso
	    		};    		    		
				params.Dimensions[0].Value = doc.InstanceId;
				params.StartTime = parseInt(currentTime/1000)-3600,
				params.EndTime = parseInt(currentTime/1000),
				params.MetricName = 'NetworkIn';
				params.Unit = 'Bytes';	    		
				cloudwatch.getMetricStatistics(params, function(err, data) {					
					doc.NetworkIn=data.Datapoints[0].Average;
					params.MetricName='NetworkOut'
		    		cloudwatch.getMetricStatistics(params, function(err, data) {
						doc.NetworkOut=data.Datapoints[0].Average;
						params.MetricName = 'CPUUtilization';
						params.Unit = 'Percent';
						cloudwatch.getMetricStatistics(params, function(err, data) {
							doc.CPUUtilization=data.Datapoints[0].Average;																								
							db.collection('ec2metrics').insert(doc);																		
							callback();
						});	
					});										
				});			
			}
			arrayIterator = function(arr){
	    		// console.log("in arrayIterator");
	    		iterate(arr[iteratorIndex],function(){
	    			iteratorIndex++;
	    			if(iteratorIndex<arr.length) arrayIterator(arr);
	    			else masterCallback();	    		
	    		});
	    	}

	    	if(runningInstances.length!= 0) {
				arrayIterator(runningInstances);
			} else {
				masterCallback();
			}
		});
	});
}