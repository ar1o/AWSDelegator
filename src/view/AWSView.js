var AWSView = Backbone.View.extend({

    className: 'AWSView',

    initialize: function(options) {
        this.productView = new ProductCostView();

        this.bindings();
        this.render();

    },

    bindings: function() {

    },

    render: function() {
        var html = Handlebars.templates.AWSView;
        this.$el.html(html);
        this.$el.append(this.productView.el);
    }
});