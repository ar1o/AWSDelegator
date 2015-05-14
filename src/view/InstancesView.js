// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars


var InstancesView = Backbone.View.extend({

    className: 'InstancesView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new InstancesModel();
        }

        var self = this;
        self.interval = setInterval(function() {
            self.model.addEC2Instance();
        }, 1000 * 60 * 60);
        this.cpuActivity = new CPUActivityView();
        this.networkInActivity = new NetworkInActivityView();
        this.networkOutActivity = new NetworkOutActivityView();

        this.bindings();
        this.render();

    },

    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {

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
            // console.log(cpuMetricCollection.pluck('instance'));
            this.cpuActivity.model.getCPUMetrics();
            this.networkInActivity.model.getNetworkInMetrics();
            this.networkOutActivity.model.getNetworkOutMetrics();

            this.render();


        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.cpuActivity.el);
        this.$el.append(this.networkInActivity.el);
        this.$el.append(this.networkOutActivity.el);
    }


});