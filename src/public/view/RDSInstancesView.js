// Here is where the RDS Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars
var RDSInstancesView = Backbone.View.extend({
    className: 'RDSInstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.model.getRDSInstances();
        this.rdsBillingActivity = new RDSBillingView();
        this.rdsMetricsActivity = new RDSMetricsView();
        this.operationsActivity = new RDSOperationsView();
        this.bindings();
    },

    updateViews: function(selected) {
        this.rdsBillingActivity.model.getRDSBilling(selected);
        var rdsDbName = selected.substring(selected.lastIndexOf(':')+1,selected.length);
        this.rdsMetricsActivity.model.getRDSMetrics(rdsDbName);
        this.operationsActivity.model.getRDSOperations(selected);
    },

    bindings: function() {
                var self = this;

        this.model.change('dataReady', function(model, val) {
            this.render();
            $('#RDSInstanceTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));


        this.$el.on('click', '#RDSInstanceTable tr', function() {
            var name = $('td', this).eq(0).text();
            // console.log('You! clicked on ' + name + '\'s row');
            if (name != "") {
                // totalCostInstancesCollection.reset();
                self.updateViews(name);
            }
        });
    },

    render: function() {
        var html = Handlebars.templates.RDSInstancesView({
            instances: InstanceCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.operationsActivity.el);
        this.$el.append(this.rdsBillingActivity.el);
        this.$el.append(this.rdsMetricsActivity.el);   

    }
});