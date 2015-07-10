var IAMUsersView = Backbone.View.extend({
    className: 'IAMUsersView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        //render own view
        this.model.getUsers();
        // child views
        // this.billingActivity = new EC2BillingView();
        // this.operationsActivity = new OperationsView();
        // this.metricsActivity = new EC2MetricsView();
        this.bindings();
    },

    updateViews: function(selected, vselected) {
        // this.billingActivity.model.calcTotalCost(selected, vselected);
        // this.metricsActivity.model.getEC2Metrics(selected);
        // this.operationsActivity.model.getEC2Operations(selected);
    },

    bindings: function() {
        var self = this;
        this.render();
        this.model.change('userDataReady', function(model, val) {
            this.render();
            $('#UsersTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

        // this.$el.on('click', '#UsersTable tr', function() {
        //     var name = $('td', this).eq(0).text();
        //  var vname = $('td', this).eq(8).text();

        //     // console.log('You! clicked on ' + vname + '\'s row');
        //     if (name != "") {
        //         self.updateViews(name, vname);
        //     }
        // });
    },

    render: function() {
        var html = Handlebars.templates.IAMUsersView({
            instances: UserCollection.toJSON()
        });
        this.$el.html(html);
        // this.$el.append(this.operationsActivity.el);
        // this.$el.append(this.billingActivity.el);
        // this.$el.append(this.metricsActivity.el);
    }
});