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
        this.modal = new BaseModalView();
        this.data = {
            budgetName: null,
            batchType: null,
            batchName: null,
            startDate: null,
            endDate: null,
            amount: null
        };
        this.bindings();
        this.render();

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
        var table = $('#BudgetTable').DataTable();

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

        this.$el.on('click', '#BudgetTable tbody tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        this.$el.on('mousedown', '#BudgetTable tbody tr', function(e) {
            if (e.button == 2) {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }

                self.data.budgetName = $('td', this).eq(0).text();
                self.data.batchType = $('td', this).eq(1).text();
                self.data.batchName = $('td', this).eq(2).text();
                self.data.startDate = $('td', this).eq(3).text();
                self.data.endDate = $('td', this).eq(4).text();
                self.data.amount = $('td', this).eq(5).text();
                console.log(self.data);
            }
        });

        // Trigger action when the contexmenu is about to be shown
        $(document).bind("contextmenu", function(event) {
            if (event.target.matches('#BudgetTable *')) {
                // console.log(rowIndex);
                // Avoid the real one
                event.preventDefault();
                // Show contextmenu
                $(".custom-menu").finish().toggle(100).
                    // In the right position (the mouse)
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
            }
        });

        // If the document is clicked somewhere

        $(document).bind("mousedown", function(e) {
            // If the clicked element is not the menu
            if (!$(e.target).parents(".custom-menu").length > 0) {
                // Hide it
                $(".custom-menu").hide(100);
            }
        });

        // If the menu element is clicked
        this.$el.on('click', '.custom-menu li', function() {
            // This is the triggered action name
            switch ($(this).attr("data-action")) {
                // A case for each action. Your actions here
                case "Edit":
                    $('.modal-title').append('<div class="content-title">Edit budget: '+ self.data.budgetName+'</div>');
                    $('.modal-body').append('<div class="content-body">EDIT CONTENT GOES HERE</div>');
                    $("#action").text("Save");
                    break;

                case "Delete":
                    $('.modal-title').append('<div class="content-title">Delete budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">Are you sure you want to delete this?</div>');
                    $("#action").text("Delete");
                    break;
            }
            // Hide it AFTER the action was triggered
            $(".custom-menu").hide(100);
        });

        this.$el.on('click', '#cancel', function() {
            $('.content-title').remove();
            $('.content-body').remove();
            $('.modal-backdrop').remove();
        });
        this.$el.on('click', '#action', function() {
            $('.content-title').remove();
            $('.content-body').remove();
            $('.modal-backdrop').remove();
            // Check for save or delete button clicked
            if ($("#action").text() == "Delete") {
                console.log("DELETING");
                //remove from table
                table.row('.selected').remove().draw( false );
                //remove from database
            } else {
                console.log("SAVING");
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
        this.$el.append(this.modal.el);

    }
});