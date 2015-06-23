// Here is where the RDS Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars
var RDSInstancesView = Backbone.View.extend({
    className: 'InstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }

        this.rdsBillingActivity = new RDSBillingView();
        this.rdsMetricsActivity = new RDSMetricsView();
        this.bindings();
    },

    updateViews: function(selected) {
            this.rdsBillingActivity.model.getRDSBilling(selected);
            var rdsDbName = selected.substring(selected.lastIndexOf(':')+1,selected.length);
            this.rdsMetricsActivity.model.getRDSMetrics(rdsDbName);
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            $('#RDSInstanceTable').DataTable({
                "iDisplayLength": 25,
                "paging":   false,
                "info":     false,
                "bFilter": false
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.RDSInstancesView({
            instances: rdsInstanceCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.rdsBillingActivity.el);
        this.$el.append(this.rdsMetricsActivity.el);      
    }
});