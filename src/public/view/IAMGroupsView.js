var UMGroupsView = Backbone.View.extend({
    className: 'UMGroupsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getGroups();
        this.usageActivity = new IAMUsageView();
        this.costActivity = new IAMCostView();
        this.operationsActivity = new IAMOperationsView();
        this.bindings();
        this.render();
    },

    updateViews: function(budgetIndex) {
        this.usageActivity.updateViews(budgetIndex);
        this.costActivity.updateViews(budgetIndex);
        this.operationsActivity.updateGroupView(budgetIndex);
    },

    bindings: function() {
        var self = this;
        this.render();
        this.model.change('groupDataReady', function(model, val) {
            this.render();
            $('#GroupsTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.IAMGroupsView({
            instances: GroupCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.usageActivity.el);
        this.$el.append(this.costActivity.el);
        this.$el.append(this.operationsActivity.el);   
    }
});