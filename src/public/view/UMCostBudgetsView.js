var UMCostBudgetsView = Backbone.View.extend({
    className: 'UMCostBudgetsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        var users = this.model.users_result(function() {
            console.log(users);
        });

        this.editHTML = '<div class="insetting"> <div class="incontainer"><label class="budget-label">Name </label><input type="text" id="budgetname" placeholder="e.g., "Monthly EC2 Budget""></div><div class="warning" id="budgetnamewarning">Invalid budget Name.</div><div class="warning" id="oldbudgetnamewarning">Budget Name already in use.</div><div class="warning" id="budgetnamerequest">Please enter a budget name.</div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Include costs related to </label><select class="costfilter"><option value="" disabled selected>Select</option><option value="user">User</option><option value="group">Groups</option></select></div></div><div class="sub-insetting"> <div class="sub-incontainer"><div id="filter-details"><select class="sub-costfilter"><option value="" disabled selected>Select</option>{{#each col}}<option value={{name}}>{{name}}</option>{{/each}}</select></div></div><div class="warning" id="batchtyperequest">Please select a Batch Type.</div><div class="warning" id="batchnamerequest">Please select a Batch Name.</div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Start date </label><input type="text" id="startdate" placeholder="mm/dd/yyyy"><div class="warning" id="startdaterequest">Please select a start date.</div></div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">End date </label><input type="text" id="enddate" placeholder="mm/dd/yyyy"><div class="warning" id="enddatewarning">Invalid dates selected.</div><div class="warning" id="enddaterequest">Please select an end.</div></div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Monthly Amount </label><input type="text" id="amount" placeholder="USD"><div class="warning" id="amountwarning">Invalid amount.</div><div class="warning" id="amountrequest">Please enter an amount.</div></div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Stop resource(s) when quota reached </label><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked><label class="onoffswitch-label" for="myonoffswitch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div></div></div>';

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
                    var sDate = "" + self.data.startDate.substr(0, 4) + '/' + self.data.startDate.substr(5, 2) + '/' + self.data.startDate.substr(8, 2);
                    var eDate = "" + self.data.endDate.substr(0, 4) + '/' + self.data.endDate.substr(5, 2) + '/' + self.data.endDate.substr(8, 2);
                    self.data.oldName = self.data.budgetName;
                    $('.modal-title').append('<div class="content-title">Edit budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">' + self.editHTML + '</div>');
                    $('#budgetname').attr('value', self.data.budgetName);
                    $('.costfilter').val(self.data.batchType);
                    $('#filter-details').show();
                    $('.sub-costfilter').val(self.data.batchName);
                    $('#startdate').attr('value', sDate);
                    $('#enddate').attr('value', eDate);
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
                    $('.modal-title').append('<div class="content-title">Delete budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">Are you sure you want to delete this?</div>');
                    $("#action").text("Delete");
                    break;
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
                console.log("DELETING");
                self.model.remove_cost_budget(self.data);

                //remove from database
            }
            if ($("#action").text() == "Save") {
                console.log(self.data);
                self.model.edit_cost_budget(self.data);
            } else {
                console.log("No Case Matched for button text");
            }

        });

        // budget name
        this.$el.on('focusout', '#budgetname', function(e) {
            if (/^[a-z\d\-_\s]+$/i.test($('#budgetname').val())) {
                $('#budgetnamewarning').hide();
                $('#budgetnamerequest').hide();
                var newBudget = true;
                for (var i = 0; i < budgetCollection.length; ++i) {
                    if (budgetCollection.at(i).get('budgetName') == $('#budgetname').val()) {
                        newBudget = false;
                    }
                }
                if (newBudget) {
                    this.$('#oldbudgetnamewarning').hide();
                    this.data.budgetName = $('#budgetname').val();
                    self.isValid.budgetName = true;
                }
                if ($('#budgetname').val() == this.data.oldName) {
                    $('#budgetnamewarning').hide();
                } else {
                    $('#oldbudgetnamewarning').show();
                }
            } else {
                $('#budgetnamewarning').show();
            }
        }.bind(this));

        // start date
        this.$el.on('focusin', '#startdate', function(e) {
            var self = this;
            var datePicker = $("#startdate").datepicker({
                onSelect: function(dateText) {
                    self.data.startDate = this.value;
                    self.isValid.startDate = true;
                    self.$('#startdaterequest').hide();
                }
            });
            $("#base-modal").scroll(function() {
                $("#startdate").datepicker("hide");
                $("#startdate").blur();
            });
        }.bind(this));

        // end date
        this.$el.on('focusin', '#enddate', function(e) {
            var self = this;
            var datePicker = $("#enddate").datepicker({
                onSelect: function(dateText) {
                    if (this.value >= self.data.startDate) {
                        self.data.endDate = this.value;
                        self.isValid.endDate = true;
                        self.$('#enddatewarning').hide();
                        self.$('#enddaterequest').hide();
                    } else {
                        self.$('#enddatewarning').show();
                    }
                }
            });
            $("#base-modal").scroll(function() {
                $("#enddate").datepicker("hide");
                $("#enddate").blur();
            });
        }.bind(this));

        // amount 
        this.$el.on('focusout', '#amount', function(e) {
            if (/^\d+(\.\d{1,2})?$/.test($('#amount').val())) {
                this.data.amount = parseFloat($('#amount').val());
                self.isValid.amount = true;
                self.$('#amountwarning').hide();
                self.$('#amountrequest').hide();
            } else {
                self.$('#amountwarning').show();
            }
        }.bind(this));

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