// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars


var CPUActivityView = Backbone.View.extend({

    className: 'CPUActivityView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new CPUActivityModel();
        }

        this.bindings();
        this.render();

    },

    //Check for when the data is read and renders the page
    bindings: function() {

        this.model.change('cpuMetrics', function(model, val) {
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
        var html = Handlebars.templates.CPUActivityView({
            cpuMetrics: cpuMetricCollection.toJSON()
        });
        this.$el.html(html);
    }


});