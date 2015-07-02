var RDSView = Backbone.View.extend({

    className: 'RDSView',

    initialize: function(options) {
        this.rdscost = new RDSCostView();
        this.rdsOperations = new AWSOperationsView();
        this.rdsOperations.model.getOperations('Amazon RDS Service');
        this.render();

    },

    bindings: function() {

    },

    render: function() {
        this.$el.append(this.rdscost.el);
        this.$el.append(this.rdsOperations.el);
    }
});