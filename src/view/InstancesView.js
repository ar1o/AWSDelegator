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
        this.billingActivity = new BillingView();

        this.bindings();
        this.render();

    },

    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();

            $(function() {
                // call the tablesorter plugin 
                $.tablesorter.defaults.widgets = ['zebra'];
                $("#InstanceTable").tablesorter({

                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });
            });

            this.cpuActivity.model.getCPUMetrics();
            // console.log(cpuMetricCollection.pluck('instance'));

            this.networkInActivity.model.getNetworkInMetrics();
            this.networkOutActivity.model.getNetworkOutMetrics();

            this.billingActivity.model.getBilling();


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
        this.$el.append(this.billingActivity.el);
    }


});