
var NetworkOutActivityView = Backbone.View.extend({

    className: 'NetworkOutActivityView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new InstancesModel();
        }

        this.bindings();
        this.render();

    },

    //Check for when the data is read and renders the page
    bindings: function() {

        this.model.change('networkOutMetrics', function(model, val) {
            this.render();

            $(function() {
                // call the tablesorter plugin
                $.tablesorter.defaults.widgets = ['zebra'];
                $("table").tablesorter({
                    theme: 'blue',

                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });

            });
        }.bind(this));

    },

    render: function() {
        var html = Handlebars.templates.NetworkOutActivityView({
            networkOutMetrics: networkOutMetricCollection.toJSON()
        });
        this.$el.html(html);
    }


});