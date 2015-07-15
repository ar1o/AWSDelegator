var IAMUsersView = Backbone.View.extend({
    className: 'IAMUsersView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getUsers();
        this.usageActivity = new UMUsageView();
        this.costActivity = new UMCostView();
        this.operationsActivity = new UMOperationsView();
        this.bindings();
        this.render();
    },

    updateViews: function(budgetIndex) {
        this.usageActivity.updateViews(budgetIndex);
        this.costActivity.updateViews(budgetIndex);
        this.operationsActivity.updateUserView(budgetIndex);
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
    },

    render: function() {
        var html = Handlebars.templates.IAMUsersView({
            instances: UserCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.usageActivity.el);
        this.$el.append(this.costActivity.el);
        this.$el.append(this.operationsActivity.el);   
    }
});