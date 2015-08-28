var AWSView = Backbone.View.extend({

    className: 'AWSView',

    initialize: function(options) {
        // this.productView = new ProductCostView();
        this.monthlyView = new AWSMonthlyCostView();
        this.bindings();
        this.render();

    },

    bindings: function() {

    },

    render: function() {
        // this.$el.append(this.productView.el);
        this.$el.append(this.monthlyView.el);
    }
});