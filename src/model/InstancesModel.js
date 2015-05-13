// This holds the entire collection of EC2 Instances and its information
var EC2InstancesCollection = Backbone.Collection.extend({
	model: InstanceModel,
	initialize: function () {
		// This will be called when an item is added. pushed or unshifted
	    this.on('add', function (model) {
	        console.log('something got added');
	    });
	}
});

// Create the collection
var instanceCollection = new EC2InstancesCollection();


// The instances model where we manipulate the data from AWS
var InstancesModel = Backbone.Model.extend({
    initialize: function() {
    	console.log("Init instances model");
    	this.change('dataReady');
	},

	// Add the information from AWS to the collection here
	addEC2Instance: function() {
		var self = this;

		aws_result().done(function(result) {
	        console.log(result);
	        for (var r in result.Reservations) {
	            for (var i in result.Reservations[r].Instances) {
	                var rInstance = result.Reservations[r].Instances[i];
	                var rImage= rInstance.ImageId;
	                var rState = rInstance.State.Name;
	                var rKeyName = rInstance.KeyName;
	                var rInstanceType = rInstance.InstanceType;
	                var rLaunchTime = rInstance.LaunchTime;
	                if (rState=="stopped"||rState=="stopping") {
	                	rDuration=0;
	                }
	                else{
	                //LOGIC FOR PARSING AND COMPUTING RUNNING TIME
	                var d = new Date();
	                var rUnixLaunch = Date.parse(rLaunchTime);
	               	var rUnixNow = d.getTime();
	               	var rDuration = (rUnixNow - rUnixLaunch)/1000;
	                }
	                var rZone = rInstance.Placement.AvailabilityZone;

	                //Email logic
	                for(var i in rInstance.Tags){
	                	if(rInstance.Tags[i].Key=="email"){
	                		rEmail = rInstance.Tags[i].Value;
	                		break;
	                	}
	                	else
	                		rEmail = "mikesmit.com@gmail.com";
	                }
	                
	                var data = new InstanceModel({ 
						instance: rInstance.InstanceId,
						imageId: rImage, 
						state: rState,
						keyName: rKeyName,
						instanceType: rInstanceType,
						launchTime: rLaunchTime,
						duration: rDuration,
						zone: rZone,
						email: rEmail
					});

	                instanceCollection.add(data);    
	                self.set('dataReady', Date.now());
        
	            }
	        }
	        }).fail(function() {
	        	console.log('FAILED');
	    });
	}
    
});


// A instance model template
var InstanceModel = Backbone.Model.extend({
	defaults: {
		instance: null,
		imageId: null,
		state: null,
		dns: null,
		keyName: null,
		instanceType: null,
		launchTime: null,
		runningTime: null,
		zone: null,
		email: "mikesmit.com@gmail.com"

    }

});