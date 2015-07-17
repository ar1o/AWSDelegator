var UsageMonitorView = Backbone.View.extend({
    className: 'UsageMonitorView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getBudgets();
        this.operationsActivity = new UMOperationsView();
        this.usageActivity = new UMUsageView();
        this.costActivity = new UMCostView();
        this.groupUserServiceView = new UMGroupUserServiceView();
        this.bindings();
        this.render();
        // $(function() {
        // });
    },

    updateUserViews: function(rowIndex) {
        this.operationsActivity.model.getUserServiceUsageChart(rowIndex);
        this.usageActivity.model.getBudgetUsageChart(rowIndex);
        this.groupUserServiceView.setUser(budgetCollection.at(rowIndex).get('batchName'));
        this.groupUserServiceView.model.getUserServiceUsageChart(rowIndex);
        this.costActivity.model.getBudgetCostChart(rowIndex);
    },

    updateGroupViews: function(rowIndex) {
        this.operationsActivity.model.getGroupServiceUsageChart(rowIndex);
        this.usageActivity.model.getBudgetUsageChart(rowIndex);
        this.costActivity.model.getBudgetCostChart(rowIndex);
    },

    bindings: function() {
        var self = this;
        var table;

        //        this.render();
        this.model.change('budgetDataReady', function(model, val) {
            this.render();
            table = $('#BudgetTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                    // "paging":   false,
                    // "info":     false,
                    // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#BudgetTable tr', function() {
            var rowIndex = this.rowIndex - 1;
            self.model.setBudgetIndex(rowIndex);
            if (budgetCollection.at(rowIndex).get('batchType') == 'user') {
                $("#serviceContainer").remove();
                self.updateUserViews(rowIndex);
            } else {
                $("#groupUserServiceContainer").remove();
                self.updateGroupViews(rowIndex);
            }
        });

        // var table = $('#BudgetTable').DataTable();

        this.$el.on('click', '#BudgetTable tbody tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    },

    render: function() {
        var html = Handlebars.templates.UsageMonitorView({
            budgets: budgetCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.operationsActivity.el);
        this.$el.append(this.usageActivity.el);
        this.$el.append(this.groupUserServiceView.el);
        this.$el.append(this.costActivity.el);
    }
});