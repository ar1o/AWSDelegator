var IAMGroupsView = Backbone.View.extend({
    className: 'IAMGroupsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getGroups();
        this.usageActivity = new UMUsageView();
        this.costActivity = new UMCostView();
        this.operationsActivity = new UMOperationsView();
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
        var table;
        this.model.change('groupDataReady', function(model, val) {
            this.render();
           table = $('#GroupsTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

        // var table = $('#GroupsTable').DataTable();

        this.$el.on('click', '#GroupsTable tbody tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
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