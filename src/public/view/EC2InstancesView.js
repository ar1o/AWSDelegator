var EC2InstancesView = Backbone.View.extend({
    className: 'EC2InstancesView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.model.getEC2Instances();
        this.billingActivity = new EC2BillingView();
        this.operationsActivity = new EC2OperationsView();
        this.metricsActivity = new EC2MetricsView();
        this.bindings();
        this.render();
    },

    updateViews: function(selected) {
        this.billingActivity.model.calcTotalCost(selected);
        this.metricsActivity.model.getEC2Metrics(selected);
        this.operationsActivity.model.getEC2Operations(selected);
    },

    bindings: function() {
        var self = this;
        var table;

        this.model.change('instancesDataReady', function(model, val) {
            this.render();
            table = $('#InstanceTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                    // "paging":   false,
                    // "info":     false,
                    // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#InstanceTable tr', function() {
            var name = $('td', this).eq(0).text();
            var state = $('td', this).eq(1).text();
            if (name != "" && state == 'running') {
                self.model.setEC2SelectedInstance(this.rowIndex - 1);
                self.updateViews(name);
            }
        });

        this.$el.on('click', '#InstanceTable tbody tr', function() {

        // $('#InstanceTable tbody').on('click', 'tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                console.log(this.$('tr.selected').removeClass('selected'));
                this.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        }.bind(this));
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