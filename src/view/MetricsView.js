var MetricsView = Backbone.View.extend({
    className: 'MetricsView',
    
    initialize: function(options) {
        if (!this.model) {
            this.model = new MetricsModel();
        }
        
        this.bindings();
        this.render();
    },

    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.MetricsView({
            metrics: metricsCollection.toJSON()
        });
        this.$el.html(html);
    }
});