var UsageMonitorView = Backbone.View.extend({
    className: 'UsageMonitorView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getBudgets();
        this.bindings();
    },

    bindings: function() {
        var self = this;
        this.render();
        this.model.change('budgetDataReady', function(model, val) {
            this.render();
            $('#BudgetTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#BudgetTable tr', function() {
            console.log($('td', this).eq(0).text())
            var name = $('td', this).eq(0).text();
            var vname = $('td', this).eq(8).text();
            if (name != "") {
                // self.updateViews(name, vname);
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