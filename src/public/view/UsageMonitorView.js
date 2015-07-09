var UsageMonitorView = Backbone.View.extend({
    className: 'UsageMonitorView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.userActivity = new IAMUsersView();
        this.groupActivity = new IAMGroupsView();
        this.model.getBudgets();
        this.bindings();
    },

    bindings: function() {
        var self = this;
        this.render();
        this.model.change('budgetDataReady', function(model, val) {
            this.render();
            $('#BudgetTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#BudgetTable tr', function() {
            var rowIndex = this.rowIndex - 1; 
            if(budgetCollection.at(rowIndex).get('batchType')=='user'){
                self.userActivity.updateViews(rowIndex);
                window.location.hash = '#/IAMUsers';
            }else{
                self.groupActivity.updateViews(rowIndex);
                window.location.hash = '#/IAMGroups';
            }
        });
    },

    render: function() {
        var html = Handlebars.templates.UsageMonitorView({
            budgets: budgetCollection.toJSON()
        });
        this.$el.html(html);
    }
});