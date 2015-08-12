var UMTimeBudgetsView = Backbone.View.extend({
    className: 'UMTimeBudgetsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        
        // this.editHTML =
        this.model.getTimeBudgets();
        this.usageActivity = new UMTimeBudgetUsageView();
        this.costActivity = new UMTimeBudgetCostView();
        this.groupUserServiceView = new UMTimeGroupUserServiceView();
        this.modal = new BaseModalView();
        this.data = {
            budgetName: null,
            batchType: null,
            batchName: null,
            startDate: null,
            endDate: null,
            amount: null
        };

        this.isValid = {
            budgetName: false,
            batchType: false,
            batchName: false,
            startDate: false,
            endDate: false,
            amount: false
        };

        this.bindings();
        this.render();
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
        // this.render();
        var table = $('#TimeBudgetTable').DataTable();
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


        this.$el.on('click', '#TimeBudgetTable tbody tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        this.$el.on('mousedown', '#TimeBudgetTable tbody tr', function(e) {
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
                // console.log(self.data);
            }
        });
        // Trigger action when the contexmenu is about to be shown
        $(document).bind("contextmenu", function(event) {
            if (event.target.matches('#TimeBudgetTable *')) {
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
                    var result;
                    console.log(this.data);
                    self.data.oldName = self.data.budgetName;
                    // console.log(self.data);
                    $('.modal-title').append('<div class="content-title">Edit budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">' + self.editHTML + '</div>');
                    $('#edit-name').append('<i class="fa fa-question-circle" id ="name-tooltop" data-toggle="tooltip" title="Edit budget name."></i>');
                    $('#edit-associated').append('<i class="fa fa-question-circle" id ="associated-tooltip" data-toggle="tooltip" title="Once created, budgets cannot change user/group association. Please create a new budget."></i>');
                    $('#edit-startDate').append('<i class="fa fa-question-circle" id ="startDate-tooltip" data-toggle="tooltip" title="Adjust start date of budget"></i>');
                    $('#edit-endDate').append('<i class="fa fa-question-circle" id ="endDate-tooltip" data-toggle="tooltip" title="Adjust end date of budget"></i>');
                    $('#edit-amount').append('<i class="fa fa-question-circle" id ="amount-tooltip" data-toggle="tooltip" title="Adjust allowance"></i>');
                    $('#edit-option').append('<i class="fa fa-question-circle" id ="endDate-tooltip" data-toggle="tooltip" title="Disable user/group upon exceeding amount?"></i>');
                    $('#budgetname').prop('value', self.data.budgetName);
                    $('.costfilter').val(self.data.batchType);
                    $('#costfilter').prop('disabled', 'disabled');
                    console.log($('.costfilter').val());
                    if ($('.costfilter').val() == 'user') {
                        self.model.getUsers();
                        self.model.change('userDataReady', function(model) {
                            result = (UserCollection.pluck('name'));
                            console.log(result);
                            for (var i in result) {
                                console.log(i, ":", result[i]);
                                if (result[i] == self.data.batchName) {
                                    console.log("match at index", i);
                                    $('.subcostfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        selected: 'selected',
                                        disabled: "disabled"
                                    }));
                                } else {
                                    $('.subcostfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        disabled: "disabled"
                                    }));
                                }
                            }
                            UserCollection.reset();
                        });
                    }
                    if ($('.costfilter').val() == 'group') {
                        self.model.getGroups();
                        self.model.change('groupDataReady', function(model) {
                            result = (GroupCollection.pluck('name'));
                            console.log(result);
                            for (var i in result) {
                                console.log(i, ":", result[i]);
                                if (result[i] == self.data.batchName) {
                                    console.log("match at index", i);
                                    $('.subcostfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        selected: "selected",
                                        disabled: "disabled"
                                    }));
                                } else {
                                    $('.subcostfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        disabled: "disabled"
                                    }));
                                }
                            }
                            GroupCollection.reset();
                        });
                    }
                    // self.data.batchName
                    $('.subcostfilter').attr('value', self.data.batchName);
                    $('#startdate').attr('value', self.data.startDate);
                    $('#enddate').attr('value', self.data.endDate);
                    $('#amount').attr('value', self.data.amount);
                    //Set Field data ^^
                    $("#action").text("Save");

                    $('#budgetnamewarning').hide();
                    $('#budgetnamerequest').hide();
                    $('#oldbudgetnamewarning').hide();
                    $('#enddatewarning').hide();
                    $('#enddaterequest').hide();
                    $('#startdaterequest').hide();
                    $('#amountwarning').hide();
                    $('#amountrequest').hide();
                    $('#batchtyperequest').hide();
                    $('#batchnamerequest').hide();
                    break;

                case "Delete":
                    // $('.modal-title').append('<div class="content-title">Delete budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">Are you sure you want to delete this?</div>');
                    $("#action").text("Delete");
            }
            // Hide it AFTER the action was triggered
            $(".custom-menu").hide(100);
        });
        this.$el.on('click', '.close', function() {
            console.log("cancelled");
            $('.content-title').remove();
            $('.content-body').remove();
            $('.modal-backdrop').remove();
        });
        this.$el.on('click', '#cancel', function() {
            console.log("cancelled");
            $('.content-title').remove();
            $('.content-body').remove();
            $('.modal-backdrop').remove();
        });

        this.$el.on('click', '#action', function() {
            //send request to model to remove budget with matching name from collection
            //console.log("cancelled");
            $('.content-title').remove();
            $('.content-body').remove();
            $('.modal-backdrop').remove();
            // Check for save or delete button clickedif (!this.model) {
            if ($("#action").text() == "Delete") {
                self.model.remove_cost_budget(self.data);
            }
            if ($("#action").text() == "Save") {
                self.model.edit_cost_budget(self.data);
            } else {
                console.log("No Case Matched for button text");
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