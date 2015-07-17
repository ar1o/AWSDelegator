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
        var table;
        this.model.change('userDataReady', function(model, val) {
            this.render();
           table = $('#UsersTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

         this.$el.on('click', '#UsersTable tbody tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
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