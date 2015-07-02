var HeaderView = Backbone.View.extend({

    className: 'HeaderView',

    initialize: function(options) {
        this.meterActivity = new MeterView();
        this.bindings();
        this.render();
    },

    bindings: function() {
    },

    render: function() {
        var html = Handlebars.templates.HeaderView;  
        this.$el.html(html);
        this.$el.append(this.meterActivity.el);       
    }
});