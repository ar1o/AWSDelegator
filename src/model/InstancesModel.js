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
	                var rState = rInstance.State.Name;
	                
	                console.log(rInstance.InstanceId + " (" + rState + ") " + rInstance.PublicDnsName);
	                
	                var data = new InstanceModel({ 
						instance: rInstance.InstanceId, 
						state: rState
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
		state: null,
		dns: null
    }

});






