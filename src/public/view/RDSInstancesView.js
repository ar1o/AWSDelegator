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
        this.instance;
        this.bindings();
        this.render();
    },

    updateViews: function(selected) {
        this.$('#dbConnectionsContainer').empty();
        this.$('#queueDepthContainer').empty();
        this.$('#rdsCpuContainer').empty();
        this.$('#readWriteIopsContainer').empty();
        this.$('.RDSBillingView').empty();
        this.rdsBillingActivity.model.getRDSBilling(selected);
        this.rdsMetricsActivity.model.getRDSMetrics(selected);
        this.rdsOperationsActivity.model.getRDSOperations(selected);
    },

    bindings: function() {
        var self = this;
        var table;
        this.model.change('instancesDataReady', function(model, val) {
            this.render();
            table = $('#RDSInstanceTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                    // "paging":   false,
                    // "info":     false,
                    // "bFilter": false
            });
        }.bind(this));


        this.$el.on('click', '#RDSInstanceTable tr', function() {
            var rowIndex = this.rowIndex - 1;
            if (self.instance != rdsInstancesCollection.at(rowIndex).get('dbName')) {
                self.instance = rdsInstancesCollection.at(rowIndex).get('dbName');
                var state = rdsInstancesCollection.at(rowIndex).get('dbStatus');
                if (state == 'available') {
                    self.model.setRDSSelectedInstance(this.rowIndex - 1);
                    self.updateViews(self.instance);
                } else {
                    this.$('#dbConnectionsContainer').empty();
                    this.$('#queueDepthContainer').empty();
                    this.$('#rdsCpuContainer').empty();
                    this.$('#readWriteIopsContainer').empty();
                    this.$('.RDSBillingView').empty();
                }
            }
        });


        this.$el.on('click', '#RDSInstanceTable tbody tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
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