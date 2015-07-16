var RDSInstancesView = Backbone.View.extend({
    className: 'RDSInstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.model.getRDSInstances();
        this.rdsBillingActivity = new RDSBillingView();
        this.rdsMetricsActivity = new RDSMetricsView();
        this.rdsOperationsActivity = new RDSOperationsView();
        this.bindings();
        this.render();
    },

    updateViews: function(selected) {
        this.rdsBillingActivity.model.getRDSBilling(selected);
        this.rdsMetricsActivity.model.getRDSMetrics(selected);
        this.rdsOperationsActivity.model.getRDSOperations(selected);
    },

    bindings: function() {
    var self = this;
        this.model.change('instancesDataReady', function(model, val) {
            this.render();
            $('#RDSInstanceTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));


        this.$el.on('click', '#RDSInstanceTable tr', function() {
            var rowIndex = this.rowIndex - 1;
            var name = rdsInstancesCollection.at(rowIndex).get('dbName');
            var state = rdsInstancesCollection.at(rowIndex).get('dbStatus');
            if (state == 'available') {
                self.model.setRDSSelectedInstance(this.rowIndex - 1);
                self.updateViews(name);
            }
        });
    },

    render: function() {
        var html = Handlebars.templates.RDSInstancesView({
            instances: rdsInstancesCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.rdsOperationsActivity.el);
        this.$el.append(this.rdsBillingActivity.el);
        this.$el.append(this.rdsMetricsActivity.el);   

    }
});