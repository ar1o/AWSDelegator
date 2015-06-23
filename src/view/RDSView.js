var RDSView = Backbone.View.extend({

    className: 'RDSView',

    initialize: function(options) {
        this.rdscost = new RDSCostView();
        this.rdsOperations = new AWSOperationsView();
        this.bindings();
        this.render();

    },

    bindings: function() {
        this.rdscost.model.getRDSCost();
        this.rdsOperations.model.getRDSOperations();
    },

    render: function() {
        this.$el.append(this.rdscost.el);
        this.$el.append(this.rdsOperations.el);
    }
});