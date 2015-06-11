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
            $(function() {
                // call the tablesorter plugin 
                $.tablesorter.defaults.sortList = [[0,0]];
                $.tablesorter.defaults.widgets = ['zebra'];
                $("#MetricsTable").tablesorter({
                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.MetricsView({
            instances: metricsCollection.toJSON()
        });
        this.$el.html(html);
    }
});