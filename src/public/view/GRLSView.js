var GRLSView = Backbone.View.extend({
    className: 'GRLSView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new GRLSModel();
        }
        this.model.getEC2Instances();
        this.model.getRDSInstances();
        this.bindings();
        this.render();
    },

    bindings: function() {
        var self = this;
        var table;

        this.model.change('ec2InstancesDataReady', function(model, val) {
            this.render();
            table = $('#EC2InstanceTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                    // "paging":   false,
                    // "info":     false,
                    // "bFilter": false
            });
        }.bind(this));

        // this.model.change('rdsInstancesDataReady', function(model, val) {
        //     this.render();
        //     table = $('#RDSInstanceTable').DataTable({
        //         "iDisplayLength": 15,
        //         "bSort": false
        //             // "paging":   false,
        //             // "info":     false,
        //             // "bFilter": false
        //     });
        // }.bind(this));

        this.$el.on('click', '#EC2InstanceTable tr', function() {
            var rowIndex = this.rowIndex - 1;
            var instance = ec2InstancesCollection.at(rowIndex).get('instance');
            var state = ec2InstancesCollection.at(rowIndex).get('state');
            console.log(ec2InstancesCollection.at(rowIndex))
            if (state == 'running') {
                // self.model.setEC2SelectedInstance(rowIndex);
                // self.updateViews(instance);
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

        var html = Handlebars.templates.GRLSView({
            ec2instances: ec2InstancesCollection.toJSON(),
            rdsinstances: rdsInstancesCollection.toJSON()
        });
        this.$el.html(html);
        // this.$el.append(this.operationsActivity.el);
        // this.$el.append(this.billingActivity.el);
        // this.$el.append(this.metricsActivity.el);
    }
});