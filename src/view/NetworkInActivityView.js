
var NetworkInActivityView = Backbone.View.extend({

    className: 'NetworkInActivityView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new NetworkInActivityModel();
        }
        this.bindings();
        this.render();
    },

    //Check for when the data is read and renders the page
    bindings: function() {

        this.model.change('dataReady', function(model, val) {
            this.render();

            $(function() {
                // call the tablesorter 
                $.tablesorter.defaults.sortList = [[0,0]];
                $.tablesorter.defaults.widgets = ['zebra'];
                $("#NetInTable").tablesorter({

                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });

            });
        }.bind(this));

    },

    render: function() {
        var html = Handlebars.templates.NetworkInActivityView({
            networkInMetrics: networkInMetricCollection.toJSON()
        });
        this.$el.html(html);
    }


});