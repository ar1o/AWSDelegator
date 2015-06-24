var RDSView = Backbone.View.extend({

    className: 'RDSView',

    initialize: function(options) {
        this.rdscost = new RDSCostView();
        
        this.bindings();
        this.render();

    },

    bindings: function() {

    },

    render: function() {
        this.$el.append(this.rdscost.el);
    }
});