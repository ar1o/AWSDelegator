// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars


var InstancesView = Backbone.View.extend({

    className: 'InstancesView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new InstancesModel();
        }

                    this.model.addEC2Instance();

        // var self = this;
        // self.interval = setInterval(function() {
        //     self.model.addEC2Instance();
        // }, 1000 * 60 * 60);
        this.cpuActivity = new CPUActivityView();
        this.networkInActivity = new NetworkInActivityView();
        this.networkOutActivity = new NetworkOutActivityView();
        this.billingActivity = new BillingView();
        this.metricsActivity = new MetricsView();
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
                $("#InstanceTable").tablesorter({

                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });
            });

            // this.cpuActivity.model.getCPUMetrics();
            // this.networkInActivity.model.getNetworkInMetrics();
            // this.networkOutActivity.model.getNetworkOutMetrics();
            this.metricsActivity.model.getMetrics('i-192650ef');
            this.billingActivity.model.getBilling('i-192650ef');
        }.bind(this));

        this.$el.on("change", '.instanceDropDown', function(e) {
            console.log( $('.instanceDropDown').val()); 
            var selected = $('.instanceDropDown').val();
            totalCostInstancesCollection.reset();
            this.billingActivity.model.getBilling($('.instanceDropDown').val()); 
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON()
        });
        this.$el.html(html);
        // this.$el.append(this.cpuActivity.el);
        // this.$el.append(this.networkInActivity.el);
        // this.$el.append(this.networkOutActivity.el);
        this.$el.append(this.billingActivity.el);
        this.$el.append(this.metricsActivity.el);
    }


});