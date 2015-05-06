var InstancesView = Backbone.View.extend({

    className: 'InstancesView',
    
	initialize: function(options) {
        
        if(!this.model) {
            this.model = new InstancesModel();
        }
       // this.ec2 = new EC2Model();
       // console.log("ec2");
       
       // console.log(AWS);
       // var ec2 = new AWS.EC2();
       console.log("test1");
       aws_result().done(function(result) {
    console.log(result);
    for (var r in result.Reservations) {
        for (var i in result.Reservations[r].Instances) {
            var instance = result.Reservations[r].Instances[i];
            var state = instance.State.Name;
            console.log(instance.InstanceId + " (" + state + ") " + instance.PublicDnsName);            
        }
    }
    }).fail(function() {
    console.log('nope');
    });
		this.render();
	},

    video_id_changed: function(model, value) {
        //this.player.model.video_id = value;
    },

	render: function() {		
        //this.$el.html(this.player.el);
	}


});