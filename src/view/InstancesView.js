// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars

var InstancesView = Backbone.View.extend({
    className: 'InstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }

        this.model.addEC2Instance();
        this.model.addRDSInstance();
        this.billingActivity = new BillingView();
        this.metricsActivity = new MetricsView();
        this.bindings();
    },

    updateViews: function(selected) {
            this.billingActivity.model.getBilling(selected); 
            this.metricsActivity.model.getMetrics(selected);
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            $('#InstanceTable').DataTable({
                "iDisplayLength": 25,
                "paging":   false,
                "info":     false,
                "bFilter": false
            });
            // this.metricsActivity.model.getMetrics(instanceCollection.at(0).get('instance'));
            // this.billingActivity.model.getBilling(instanceCollection.at(0).get('instance'));
        }.bind(this));

        this.$el.on("change", '.instanceDropDown', function(e) {
            var selected = $('.instanceDropDown').val();
            console.log(selected);
            totalCostInstancesCollection.reset();
            this.billingActivity.model.getBilling(selected); 
            this.metricsActivity.model.getMetrics(selected);
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.billingActivity.el);
        this.$el.append(this.metricsActivity.el);      
    }
});