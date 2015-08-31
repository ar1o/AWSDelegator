var EC2InstancesView = Backbone.View.extend({
    className: 'EC2InstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        var self = this;
        this.model.getEC2Instances();
        this.billingActivity = new EC2BillingView();
        this.operationsActivity = new EC2OperationsView();
        this.metricsActivity = new EC2MetricsView();

        this.instance;

        this.bindings();
        this.render();
    },

    updateViews: function(selected) {
        this.$('#billingcontainer').empty();
        this.$('#ec2operationscontainer').empty();
        this.$('#ec2operationscontainer').empty();
        this.$('#networkContainer').empty();
        this.$('#cpuContainer').empty();
        this.billingActivity.model.calcTotalCost(selected);
        this.metricsActivity.model.getEC2Metrics(selected);
        this.operationsActivity.model.getEC2Operations(selected);
    },

    bindings: function() {
        var self = this;
        var table;

        this.model.change('instancesDataReady', function(model, val) {
            this.render();
            table = $('#EC2InstanceTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                    // "paging":   false,
                    // "info":     false,
                    // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#EC2InstanceTable tr', function() {
            var rowIndex = this.rowIndex - 1;
            if (self.instance != ec2InstancesCollection.at(rowIndex).get('instance')) {
                self.instance = ec2InstancesCollection.at(rowIndex).get('instance');
                var state = ec2InstancesCollection.at(rowIndex).get('state');
                if (state == 'running') {
                    self.model.setEC2SelectedInstance(rowIndex);
                    self.updateViews(self.instance);
                } else {
                    self.$('#billingcontainer').empty();
                    self.$('#ec2operationscontainer').empty();
                    self.$('#ec2operationscontainer').empty();
                    self.$('#networkContainer').empty();
                    self.$('#cpuContainer').empty();
                }
            }
        });

        var table = $('#EC2InstanceTable').DataTable();

        this.$el.on('click', '#EC2InstanceTable tbody tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    },

    render: function() {

        var html = Handlebars.templates.EC2InstancesView({
            instances: ec2InstancesCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.operationsActivity.el);
        this.$el.append(this.billingActivity.el);
        this.$el.append(this.metricsActivity.el);
    }
});