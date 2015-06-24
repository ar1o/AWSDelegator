var FooterView = Backbone.View.extend({

    className: 'FooterView',

    initialize: function(options) {

        this.bindings();
        this.render();

    },

    bindings: function() {

    },

    render: function() {
        var html = Handlebars.templates.FooterView;
        this.$el.html(html);

       
    }
});