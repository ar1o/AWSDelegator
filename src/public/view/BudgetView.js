var BudgetView = Backbone.View.extend({

    className: 'BudgetView',

    initialize: function(options) {
        this.bindings();
        this.render();

    },

    bindings: function() {

    },

    render: function() {
        var html = Handlebars.templates.BudgetView;
        this.$el.html(html);
    }
});