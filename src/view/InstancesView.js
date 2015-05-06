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
        this.model.change('video_id', this.video_id_changed.bind(this));
        
		this.render();

         $.getJSON( "js/EC2Test.js", function( json ) {
            console.log( "JSON Data: " + json );
        });   
	},

    video_id_changed: function(model, value) {
        //this.player.model.video_id = value;
    },

	render: function() {		
        //this.$el.html(this.player.el);
	}


});