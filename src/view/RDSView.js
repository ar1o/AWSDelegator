var RDSView = Backbone.View.extend({

    className: 'RDSView',

    initialize: function(options) {
        console.log("RDSView initialize");

        // this.ec2cost = new EC2CostView();
        
        this.bindings();
        this.render();

    },

    bindings: function() {

    },

    render: function() {
        // this.$el.append(this.ec2cost.el);
    }
});