var EC2View = Backbone.View.extend({

    className: 'EC2View',

    initialize: function(options) {
        this.ec2cost = new EC2CostView();
        this.ec2Operations = new AWSOperationsView();
        this.ec2Operations.model.getOperations('Amazon Elastic Compute Cloud');
        this.render();

    },

    bindings: function() {
    },

    render: function() {
        this.$el.append(this.ec2cost.el);
        this.$el.append(this.ec2Operations.el);
    }

});