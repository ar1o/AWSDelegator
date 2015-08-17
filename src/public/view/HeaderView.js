var HeaderView = Backbone.View.extend({

    className: 'HeaderView',

    initialize: function(options) {
        // this.latestTime = new TimeView();
        this.meterActivity = new MeterView();
        // this.budgetView = new BudgetView();
        this.bindings();
        this.render();
    },

    bindings: function() {
    },

    render: function() {
        var html = Handlebars.templates.HeaderView;        
        this.$el.html(html);
        this.$el.append(this.meterActivity.el);       
        // this.$el.append(this.latestTime.el);       

    }
});