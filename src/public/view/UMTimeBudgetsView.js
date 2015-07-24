var UMTimeBudgetsView = Backbone.View.extend({
    className: 'UMTimeBudgetsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getTimeBudgets();
        this.usageActivity = new UMTimeBudgetUsageView();
        this.costActivity = new UMTimeBudgetCostView();
        this.groupUserServiceView = new UMTimeGroupUserServiceView();
        this.bindings();
    },

    updateUserViews: function(rowIndex) {
        this.usageActivity.model.getTimeBudgetUsageChart(rowIndex);
        this.groupUserServiceView.setUser(timeBudgetCollection.at(rowIndex).get('batchName'));
        this.groupUserServiceView.model.getTimeUserServiceUsageChart(rowIndex);
        this.costActivity.model.getTimeBudgetCostChart(rowIndex);
    },

    updateGroupViews: function(rowIndex) {
        this.usageActivity.model.getTimeBudgetUsageChart(rowIndex);
        this.costActivity.model.getTimeBudgetCostChart(rowIndex);
    },

    bindings: function() {
        var self = this;
        this.render();
        this.model.change('timeBudgetDataReady', function(model, val) {
            this.render();
            $('#TimeBudgetTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#TimeBudgetTable tr', function() {
            var rowIndex = this.rowIndex - 1; 
            self.model.setBudgetIndex(rowIndex);
            if(timeBudgetCollection.at(rowIndex).get('batchType')=='user'){
                $("#serviceContainer").remove();
                self.updateUserViews(rowIndex);
            }else{
                $("#groupUserServiceContainer").remove();
                self.updateGroupViews(rowIndex);
            }
        });
    },

    render: function() {
        var html = Handlebars.templates.UMTimeBudgetsView({
            timebudgets: timeBudgetCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.usageActivity.el);
        this.$el.append(this.groupUserServiceView.el);
        this.$el.append(this.costActivity.el);
    }
});