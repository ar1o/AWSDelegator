var HeaderView = Backbone.View.extend({

    className: 'HeaderView',

    initialize: function(options) {
        // this.meterActivity = new MeterView();
        // this.budgetView = new BudgetView();
        this.bindings();
        this.render();
    },

    bindings: function() {
    },

    render: function() {
        var html = Handlebars.templates.HeaderView;        
        this.$el.html(html);
        // this.$el.append(this.meterActivity.el);       
        // this.$el.append(this.budgetView.el);       

    }
});