//View for EDITING CostBudget 
var daysToAdd = 1;
var UMCostBudgetsView = Backbone.View.extend({
    className: 'UMCostBudgetsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.editHTML = '<div class="insetting"> <div class="incontainer"><label class="budget-label">Name <i class="fa fa-question-circle" id="BudgetName" data-toggle="tooltip" title="Unique name assigned to this Cost Budget"></i></label><input type="text" id="budgetname" placeholder="e.g., "Monthly EC2 Budget"></div><div class="warning" id="budgetnamewarning">Invalid budget Name.</div><div class="warning" id="oldbudgetnamewarning">Budget Name already in use.</div><div class="warning" id="budgetnamerequest">Please enter a budget name.</div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Track costs associated to <i class="fa fa-question-circle" id="AssociatedTo" data-toggle="tooltip" title="User or group this budget applies to"></i></label><select class="costfilter"><option value="" disabled selected>Select</option><option value="user">User</option><option value="group">Groups</option></select></div></div><div class="sub-insetting"> <div class="sub-incontainer"><div class="" id="filter-details"><select class="sub-costfilter"><option value="" disabled selected>Select</option>{{#each col}}<option value={{this.name}}></option>{{/each}}</select></div></div><div class="warning" id="batchtyperequest">Please select a Batch Type.</div><div class="warning" id="batchnamerequest">Please select a Batch Name.</div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Start date <i class="fa fa-question-circle" id="StartDate" data-toggle="tooltip" title="Date when budget begins"></i></label><input type="text" id="startdate" placeholder="mm/dd/yyyy"><div class="warning" id="startdaterequest">Please select a start date.</div></div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">End date <i class="fa fa-question-circle" id="EndDate" data-toggle="tooltip" title="Date of termination for budget"></i></label><input type="text" id="enddate" placeholder="mm/dd/yyyy"><div class="warning" id="enddatewarning">Invalid dates selected.</div><div class="warning" id="enddaterequest">Please select an end.</div></div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Cost Amount <i class="fa fa-question-circle" id="CostAmount" data-toggle="tooltip" title="Dollar amount the associated user/group is allocated between start and end dates"></i></label><input type="text" id="amount" placeholder="USD"><div class="warning" id="amountwarning">Invalid amount.</div><div class="warning" id="amountrequest">Please enter an amount.</div></div></div><div class="insetting"> <div class="incontainer"><label class="budget-label">Stop resource(s) when quota reached <i class="fa fa-question-circle" id="Stop" data-toggle="tooltip" title="Stop instance when budget is exceeded?"></i></label><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked><label class="onoffswitch-label" for="myonoffswitch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div></div></div>';
        //get data to populate the table
        this.model.getBudgets();
        //?
        this.operationsActivity = new UMOperationsView();
        //progress bar
        this.usageActivity = new UMUsageView();
        //line chart
        this.costActivity = new UMCostView();
        //donut chart
        this.groupUserServiceView = new UMGroupUserServiceView();
        //edit view
        this.modal = new BaseModalView();

        this.data = {
            budgetName: null,
            batchType: null,
            batchName: null,
            startDate: null,
            endDate: null,
            amount: null,
            timeout: true
        };

        this.isValid = {
            budgetName: false,
            batchType: false,
            batchName: false,
            startDate: false,
            endDate: false,
            amount: false,
            timeout: true
        };

        this.bindings();
        this.render();
    },

    updateUserViews: function(rowIndex) {
        // this.operationsActivity.model.getUserServiceUsageChart(rowIndex);
        this.usageActivity.model.getBudgetUsageChart(rowIndex);
        this.groupUserServiceView.setUser(budgetCollection.at(rowIndex).get('batchName'));
        this.groupUserServiceView.model.getUserServiceUsageChart(rowIndex);
        this.costActivity.model.getBudgetCostChart(rowIndex);
    },

    updateGroupViews: function(rowIndex) {
        this.usageActivity.model.getBudgetUsageChart(rowIndex);
        // this.operationsActivity.model.getGroupServiceUsageChart(rowIndex);
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
            if (($('#BudgetTable').find("tbody > tr > td").length) > 6) {
                var rowIndex = this.rowIndex - 1;
                self.model.setBudgetIndex(rowIndex);
                if (budgetCollection.at(rowIndex).get('batchType') == 'user') {
                    $("#serviceContainer").remove();
                    self.updateUserViews(rowIndex);
                } else {
                    $("#groupUserServiceContainer").remove();
                    self.updateGroupViews(rowIndex);
                }
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
                self.data.timeout = $('td', this).eq(6).text();
            }
        });

        // Trigger action when the contexmenu is about to be shown
        $(document).bind("contextmenu", function(event) {
            if (event.target.matches('#BudgetTable *')) {
                // console.log(rowIndex);
                // Avoid the real one
                event.preventDefault();
                if (($('#BudgetTable').find("tbody > tr > td").length) > 6) {
                    // Show contextmenu
                    $(".custom-menu").finish().toggle(100).
                        // In the right position (the mouse)
                    css({
                        top: event.pageY + "px",
                        left: event.pageX + "px"
                    });
                }            }
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

                    var sDate = "" + self.data.startDate.substr(0, 4) + '/' + self.data.startDate.substr(5, 2) + '/' + self.data.startDate.substr(8, 2);
                    var eDate = "" + self.data.endDate.substr(0, 4) + '/' + self.data.endDate.substr(5, 2) + '/' + self.data.endDate.substr(8, 2);

                    self.data.oldName = self.data.budgetName;

                    $('.modal-title').append('<div class="content-title">Edit budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">' + self.editHTML + '</div>');
                    $('#budgetname').prop('value', self.data.budgetName);
                    $('.costfilter').val(self.data.batchType);
                    $('.costfilter').prop('disabled', 'disabled');
                    $('.sub-costfilter').prop('disabled', 'disabled');

                    if (self.data.timeout == 'true') {
                        $('#myonoffswitch').prop('checked', 'checked');
                    }
                    if (self.data.timeout == 'false') {
                        $('#myonoffswitch').prop('checked', '');
                    }
                    if ($('.costfilter').val() == 'user') {
                        self.model.getUsers();
                        self.model.change('userDataReady', function(model) {
                            result = (UserCollection.pluck('name'));
                            for (var i in result) {
                                if (result[i] == self.data.batchName) {
                                    $('.sub-costfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        selected: 'selected',
                                        disabled: "disabled"
                                    }));
                                } else {
                                    $('.sub-costfilter').append($('<option>', {
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
                            for (var i in result) {
                                if (result[i] == self.data.batchName) {
                                    $('.sub-costfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        selected: "selected",
                                        disabled: "disabled"
                                    }));
                                } else {
                                    $('.sub-costfilter').append($('<option>', {
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
                    $('.sub-costfilter').prop('value', self.data.batchName);

                    $('oldbudgetnamewarning').hide();
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

                    $('.costfilter').val(self.data.batchType);
                    $('#filter-details').show();
                    $('.sub-costfilter').val(self.data.batchName);
                    $('#startdate').attr('value', sDate);
                    $('#enddate').attr('value', eDate);
                    $('#amount').attr('value', self.data.amount);

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
        this.$el.on('click', '.close', function() {
            $('.costfilter').prop('disabled', '');
            $('.sub-costfilter').prop('disabled', '');
            $('.costfilter').val('');
            $('.content-title').remove();
            $('.content-body').remove();
            $('.modal-backdrop').remove();
        });
        this.$el.on('click', '#cancel', function() {
            $('.costfilter').prop('disabled', '');
            $('.sub-costfilter').prop('disabled', '');
            $('.costfilter').val('');
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
                $('#base-modal').hide();
            }
            if ($("#action").text() == "Save") {
                self.model.edit_cost_budget(self.data);
                $('.costfilter').prop('disabled', '');
                $('.sub-costfilter').prop('disabled', '');
                $('.costfilter').val('');
                $('#base-modal').hide();
            } else {
                console.log("No Case Matched for button text");
            }

        });

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
                } else if ($('#budgetname').val() == this.data.oldName) {} else {
                    $('#oldbudgetnamewarning').show();
                }
            } else {
                $('#budgetnamewarning').show();
            }
        }.bind(this));
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
        // start date
        this.$el.on('focusin', '#startdate', function(e) {
            var self = this;
            $("#startdate").datepicker({
                onSelect: function(selected) {
                    var dtMax = new Date(selected);
                    dtMax.setDate(dtMax.getDate() + daysToAdd);
                    var dd = dtMax.getDate();
                    var mm = dtMax.getMonth() + 1;
                    var y = dtMax.getFullYear();
                    var dtFormatted = mm + '/' + dd + '/' + y;
                    $("#enddate").datepicker("option", "minDate", dtFormatted);
                    $('#startdaterequest').hide();
                },
                onClose: function(selected) {
                    console.log("startdate", selected);
                    self.data.startDate = selected;
                    self.isValid.startDate = true;
                }
            });
        }.bind(this));

        this.$el.on('focusin', '#enddate', function(e) {
            var self = this;
            $("#enddate").datepicker({
                onSelect: function(selected) {
                    var dtMax = new Date(selected);
                    dtMax.setDate(dtMax.getDate() - daysToAdd);
                    var dd = dtMax.getDate();
                    var mm = dtMax.getMonth() + 1;
                    var y = dtMax.getFullYear();
                    var dtFormatted = mm + '/' + dd + '/' + y;
                    $("#startdate").datepicker("option", "maxDate", dtFormatted)
                    $('#enddaterequest').hide();
                },
                onClose: function(selected) {
                    //end
                    var dtMax = new Date(selected);
                    var edd = dtMax.getDate();
                    var emm = dtMax.getMonth() + 1;
                    var ey = dtMax.getFullYear();
                    var edtFormatted = emm + '/' + edd + '/' + ey;
                    //start
                    var dtMin = new Date(self.data.startDate);
                    var sdd = dtMin.getDate();
                    var smm = dtMin.getMonth() + 1;
                    var sy = dtMin.getFullYear();
                    var sdtFormatted = smm + '/' + sdd + '/' + sy;
                    //logic
                    if (edtFormatted == sdtFormatted || ey < sy || ey == sy && emm < smm || ey == sy && emm == smm && edd < sdd) {
                        var sdd = dtMax.getDate() - 1;
                        var smm = dtMax.getMonth() + 1;
                        var sy = dtMax.getFullYear();
                        var sdtFormatted = smm + '/' + sdd + '/' + sy;
                        self.data.startDate = sdtFormatted;
                    }
                    self.data.endDate = selected;
                    self.isValid.endDate = true;
                }
            });
        }.bind(this));
        this.$el.on('click', '#myonoffswitch', function(e) {
            this.data.timeout = $('#myonoffswitch').prop('checked');
            this.isValid.timeout = true
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