// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars
var EC2InstancesView = Backbone.View.extend({
    className: 'EC2InstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        //render own view
        this.model.getEC2Instances();
        // child views
        this.billingActivity = new EC2BillingView();
        this.operationsActivity = new OperationsView();
        this.metricsActivity = new EC2MetricsView();
        this.bindings();
    },

    updateViews: function(selected) {
        this.billingActivity.model.getBilling(selected);
        this.metricsActivity.model.getEC2Metrics(selected);
        this.operationsActivity.model.getEC2Operations(selected);
    },

    bindings: function() {
        var self = this;
        this.render();
        this.model.change('dataReady', function(model, val) {
            this.render();
            $('#InstanceTable').DataTable({
                "iDisplayLength": 25
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#InstanceTable tr', function() {
            var name = $('td', this).eq(0).text();
            // console.log('You! clicked on ' + name + '\'s row');
            if (name != "") {
                totalCostInstancesCollection.reset();
                self.updateViews(name);
            }
        });
    },

    render: function() {
        var html = Handlebars.templates.EC2InstancesView({
            instances: InstanceCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.operationsActivity.el);
        this.$el.append(this.billingActivity.el);
        this.$el.append(this.metricsActivity.el);
    }
});