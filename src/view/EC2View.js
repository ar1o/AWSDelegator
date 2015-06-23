var EC2View = Backbone.View.extend({

    className: 'EC2View',

    initialize: function(options) {
        this.ec2cost = new EC2CostView();
        this.ec2Operations = new AWSOperationsView();
        this.bindings();
        this.render();

    },

    bindings: function() {
        this.ec2cost.model.getEC2Cost();
        this.ec2Operations.model.getEC2Operations();
    },

    render: function() {
        this.$el.append(this.ec2cost.el);
        this.$el.append(this.ec2Operations.el);
    }
});