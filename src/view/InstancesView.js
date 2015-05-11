// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars
var InstancesView = Backbone.View.extend({

    className: 'InstancesView',
    
	initialize: function(options) {
        
        if(!this.model) {
            this.model = new InstancesModel();
        }
  
        this.model.addEC2Instance();

        this.bindings();
        this.render();
	},
    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {
        this.render();
    }.bind(this));

    },

	render: function() {		
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON()

        });
        this.$el.html(html);
	}


});