//View for EDITING TimeBudgets
var daysToAdd = 1;
var UMTimeBudgetsView = Backbone.View.extend({
    className: 'UMTimeBudgetsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }

        this.editHTML = '<div class="insetting"><div class="incontainer"><label class="budget-label">Name <i class="fa fa-question-circle" id="TimeBudgetName" data-toggle="tooltip" title="Unique name assigned to this Time Budget"></i></label><input type="text" id="time-budgetname" placeholder="e.g., "Monthly EC2 Budget""></div><div class="warning" id="time-budgetnamewarning">Invalid budget Name.</div><div class="warning" id="time-oldbudgetnamewarning">Budget Name already in use.</div><div class="warning" id="time-budgetnamerequest">Please enter a budget name.</div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Time budget related to <i class="fa fa-question-circle" id="TimeBudgetAssociatedTo" data-toggle="tooltip" title="User or group this budget applies to. Once these values are set, they cannot be edited."></i></label><select class="time-costfilter"><option value="" disabled selected>Select</option><option value="user">User</option><option value="group">Groups</option></select></div></div><div class="sub-insetting"><div class="sub-incontainer"><div class="" id="time-filter-details"><select class="time-sub-costfilter"><option value="" disabled selected>Select</option>{{#each col}}<option value={{this.name}}></option>{{/each}}</select></div></div><div class="warning" id="time-batchtyperequest">Please select a Batch Type.</div><div class="warning" id="time-batchnamerequest">Please select a Batch Name.</div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Start date <i class="fa fa-question-circle" id="StartDate" data-toggle="tooltip" title="Date when budget begins"></i></label><input type="text" id="time-startdate" placeholder="mm/dd/yyyy"><div class="warning" id="time-startdaterequest">Please select a start date.</div></div></div><div class="insetting"><div class="incontainer"><label class="budget-label">End date <i class="fa fa-question-circle" id="EndDate" data-toggle="tooltip" title="Date of termination for budget"></i></label><input type="text" id="time-enddate" placeholder="mm/dd/yyyy"><div class="warning" id="time-enddatewarning">Invalid dates selected.</div><div class="warning" id="time-enddaterequest">Please select an end.</div></div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Time Amount <i class="fa fa-question-circle" id="TimeAmount" data-toggle="tooltip" title="Number of hours of time in use for instance during budget duration"></i></label><input type="text" id="time-amount" placeholder="Hours"><div class="warning" id="time-amountwarning">Invalid time amount.</div><div class="warning" id="time-amountrequest">Please enter a time amount.</div></div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Under-profile Decay Rate <i class="fa fa-question-circle" id="UnderProfile" data-toggle="tooltip" title="Rate at which hours of usage are consumed when the instance is being used less than what is optimal"></i></label><input type="text" id="time-udecay" placeholder="e.g., 3"><div class="warning" id="time-udecaywarning">Invalid decay rate.</div><div class="warning" id="time-udecayrequest">Please enter a decay rate.</div></div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Over-profile Decay Rate <i class="fa fa-question-circle" id="OverProfile" data-toggle="tooltip" title="Rate at which hours of usage are consumed when the instance is being used more than what is optimal"></i></label><input type="text" id="time-odecay" placeholder="e.g., 2"><div class="warning" id="time-odecaywarning">Invalid decay rate.</div><div class="warning" id="time-odecayrequest">Please enter a decay rate.</div></div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Min Database Connections <i class="fa fa-question-circle" id="minDatabase" data-toggle="tooltip" title="Minimum number of acceptable database connections at a given time"></i></label><input type="text" id="time-minDB" placeholder="e.g., 5"><div class="warning" id="time-minDBwarning">Invalid number.</div><div class="warning" id="time-minDBrequest">Please enter a number.</div></div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Max Database Connections <i class="fa fa-question-circle" id="maxDatabase" data-toggle="tooltip" title="Maximum number of acceptable database connections at a given time"></i></label><input type="text" id="time-maxDB" placeholder="e.g., 50"><div class="warning" id="time-maxDBwarning">Invalid number.</div><div class="warning" id="time-maxDBrequest">Please enter a number.</div></div></div><div class="insetting"><div class="incontainer"><label class="budget-label">Stop resource(s) when quota reached <i class="fa fa-question-circle" id="TimeBudgetStop" data-toggle="tooltip" title="Stop instance when provided time is exceeded?"></i></label><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="time-myonoffswitch" checked><label class="onoffswitch-label" for="time-myonoffswitch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div></div></div>';
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
            amount: null,
            uDecayRate: null,
            oDecayRate: null,
            minDB: null,
            maxDB: null,
            timeout: true
        };

        this.isValid = {
            budgetName: false,
            batchType: false,
            batchName: false,
            startDate: false,
            endDate: false,
            amount: false,
            uDecayRate: false,
            oDecayRate: false,
            minDB: false,
            maxDB: false,
            timeout: true
        };

        this.bindings();
        this.render();
    },

    updateUserViews: function(rowIndex) {
        this.usageActivity.model.getTimeBudgetUsageChart(rowIndex);
        this.groupUserServiceView.setUser(timeBudgetCollection.at(rowIndex).get('batchName'));
        this.groupUserServiceView.model.getTimeUserServiceUsageChart(rowIndex);
        this.costActivity.model.getTimeBudgetCostChart(rowIndex);
        
        // this.costActivity.model.getUserTimeCostBudget(rowIndex);

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
            table = $('#TimeBudgetTable').DataTable({
                "iDisplayLength": 15,
                "bSort": false
                    // "paging":   false,
                    // "info":     false,
                    // "bFilter": false
            });
        }.bind(this));

        this.$el.on('click', '#TimeBudgetTable tr', function() {
            if (($('#TimeBudgetTable').find("tbody > tr > td").length) > 6) {
                var rowIndex = this.rowIndex - 1;
                self.model.setBudgetIndex(rowIndex);
                if (timeBudgetCollection.at(rowIndex).get('batchType') == 'user') {
                    $("#serviceContainer").remove();
                    self.updateUserViews(rowIndex);
                    // console.log("UPDATE");
                } else {
                    $("#groupUserServiceContainer").remove();
                    self.updateGroupViews(rowIndex);
                }
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
                self.data.timeamount = $('td', this).eq(5).text();
                self.data.uDecay = $('td', this).eq(6).text();
                self.data.oDecay = $('td', this).eq(7).text();
                self.data.minDB = $('td', this).eq(8).text();
                self.data.maxDB = $('td', this).eq(9).text();
                self.data.timeout = $('td', this).eq(10).text();
            }
        });
        // Trigger action when the contexmenu is about to be shown
        // $(document).bind("contextmenu", function(event) {
        this.$el.on('contextmenu', '#TimeBudgetTable tbody tr', function(e) {
            if (event.target.matches('#TimeBudgetTable *')) {
                event.preventDefault();
                if (($('#TimeBudgetTable').find("tbody > tr > td").length) > 6) {
                    // Avoid the real one
                    // Show contextmenu
                    $(".custom-menu").finish().toggle(100).
                        // In the right position (the mouse)
                    css({
                        top: event.pageY + "px",
                        left: event.pageX + "px"
                    });
                }
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
                    self.data.oldName = self.data.budgetName;
                    $('.modal-title').append('<div class="content-title">Edit budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">' + self.editHTML + '</div>');
                    $('#time-budgetname').prop('value', self.data.budgetName);
                    $('.time-costfilter').prop('value', self.data.batchType);
                    $('.time-costfilter').prop('disabled', 'disabled');
                    $('.time-sub-costfilter').prop('disabled', 'disabled');
                    $('#time-startdate').prop('value', self.data.startDate);
                    $('#time-enddate').prop('value', self.data.endDate);
                    $('#time-amount').prop('value', self.data.timeamount);
                    $('#time-udecay').prop('value', self.data.uDecay);
                    $('#time-odecay').prop('value', self.data.oDecay);
                    $('#time-minDB').prop('value', self.data.minDB);
                    $('#time-maxDB').prop('value', self.data.maxDB);
                    var state = self.data.timeout;
                    if (self.data.timeout == 'true') {
                        $('#time-myonoffswitch').prop('checked', 'checked');
                    }
                    if (self.data.timeout == 'false') {
                        $('#time-myonoffswitch').prop('checked', '');
                    }
                    $('#time-myonoffswitch').attr('checked', self.data.timeout);
                    $('#time-filter-details').prop('display', true);
                    if ($('.time-costfilter').val() == 'user') {
                        self.model.getUsers();
                        self.model.change('userDataReady', function(model) {
                            result = (UserCollection.pluck('name'));
                            for (var i in result) {
                                if (result[i] == self.data.batchName) {
                                    $('.time-sub-costfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        selected: 'selected',
                                        disabled: "disabled"
                                    }));
                                } else {
                                    $('.time-sub-costfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        disabled: "disabled"
                                    }));
                                }
                            }
                            UserCollection.reset();
                        });
                    }
                    if ($('.time-costfilter').val() == 'group') {
                        self.model.getGroups();
                        self.model.change('groupDataReady', function(model) {
                            result = (GroupCollection.pluck('name'));
                            for (var i in result) {
                                if (result[i] == self.data.batchName) {
                                    // console.log("Matched with", result[i]);
                                    $('.time-sub-costfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        selected: "selected",
                                        disabled: "disabled"
                                    }));
                                } else {
                                    $('.time-sub-costfilter').append($('<option>', {
                                        value: result[i],
                                        text: result[i],
                                        disabled: "disabled"
                                    }));
                                }
                            }
                            GroupCollection.reset();
                        });
                    }
                    $('.time-sub-costfilter').prop('value', self.data.batchName);
                    $("#action").text("Save");
                    $('#time-minDBwarning').hide();
                    $('#time-minDBrequest').hide();
                    $('#time-maxDBwarning').hide();
                    $('#time-maxDBrequest').hide();
                    $('#time-odecaywarning').hide();
                    $('#time-udecaywarning').hide();
                    $('#time-odecayrequest').hide();
                    $('#time-udecayrequest').hide();
                    $('#time-budgetnamewarning').hide();
                    $('#time-budgetnamerequest').hide();
                    $('#time-oldbudgetnamewarning').hide();
                    $('#time-enddatewarning').hide();
                    $('#time-enddaterequest').hide();
                    $('#time-startdaterequest').hide();
                    $('#time-amountwarning').hide();
                    $('#time-amountrequest').hide();
                    $('#time-batchtyperequest').hide();
                    $('#time-batchnamerequest').hide();
                    break;

                case "Delete":
                    // $('.modal-title').append('<div class="content-title">Delete budget: ' + self.data.budgetName + '</div>');
                    $('.modal-body').append('<div class="content-body">Are you sure you want to delete this?</div>');
                    $("#action").text("Delete");
                    break;
            }
            // Hide it AFTER the action was triggered
            $(".custom-menu").hide(100);
        });
        this.$el.on('click', '.close', function() {
            // console.log("cancelled");
            $('.time-costfilter').prop('disabled', '');
            $('.time-sub-costfilter').prop('disabled', '');
            $('.time-costfilter').val('');
            $('time-minDB').val('');
            $('time-maxDB').val('');
            $('.content-title').remove();
            $('.content-body').remove();
            $('.modal-backdrop').remove();
        });
        this.$el.on('click', '#cancel', function() {
            // console.log("cancelled");
            $('.time-costfilter').prop('disabled', '');
            $('.time-sub-costfilter').prop('disabled', '');
            $('.time-costfilter').val('');
            $('time-minDB').val('');
            $('time-maxDB').val('');
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
                self.model.remove_time_budget(self.data);
                $('#base-modal').hide();
            }
            if ($("#action").text() == "Save") {
                self.model.edit_time_budget(self.data);
                $('.time-costfilter').prop('disabled', '');
                $('.time-sub-costfilter').prop('disabled', '');
                $('.time-costfilter').val('');
                $('#base-modal').hide();
            } else {
                console.log("No Case Matched for button text");
            }

        });
        this.$el.on('focusout', '#time-budgetname', function(e) {
            if (/^[a-z\d\-_\s]+$/i.test($('#time-budgetname').val())) {
                $('#time-budgetnamewarning').hide();
                $('#time-budgetnamerequest').hide();
                var newBudget = true;
                for (var i = 0; i < budgetCollection.length; ++i) {
                    if (budgetCollection.at(i).get('budgetName') == $('#time-budgetname').val()) {
                        newBudget = false;
                    }
                }
                if (newBudget) {
                    this.$('#time-oldbudgetnamewarning').hide();

                    this.data.budgetName = $('#time-budgetname').val();
                    self.isValid.budgetName = true;
                } else if ($('#time-budgetname').val() == this.data.oldName) {
                    $('#time-budgetnamewarning').hide();
                } else {
                    $('#time-oldbudgetnamewarning').show();
                }
            } else {
                $('#time-budgetnamewarning').show();
            }
        }.bind(this));

        this.$el.on('focusin', '#time-startdate', function(e) {
            var self = this;
            $("#time-startdate").datepicker({
                onSelect: function(selected) {
                    var dtMax = new Date(selected);
                    dtMax.setDate(dtMax.getDate() + daysToAdd);
                    var dd = dtMax.getDate();
                    var mm = dtMax.getMonth() + 1;
                    var y = dtMax.getFullYear();
                    var dtFormatted = mm + '/' + dd + '/' + y;
                    $("#time-enddate").datepicker("option", "minDate", dtFormatted);
                    $('#time-startdaterequest').hide();
                },
                onClose: function(selected) {
                    self.data.startDate = selected;
                    self.isValid.startDate = true;
                }
            });
        }.bind(this));

        this.$el.on('focusin', '#time-enddate', function(e) {
            var self = this;
            $("#time-enddate").datepicker({
                onSelect: function(selected) {
                    var dtMax = new Date(selected);
                    dtMax.setDate(dtMax.getDate() - daysToAdd);
                    var dd = dtMax.getDate();
                    var mm = dtMax.getMonth() + 1;
                    var y = dtMax.getFullYear();
                    var dtFormatted = mm + '/' + dd + '/' + y;
                    var dtNow = new Date();
                    var ndd = dtNow.getDate();
                    var nmm = dtNow.getMonth() + 1;
                    var ny = dtNow.getFullYear();
                    var ndtFormatted = nmm + '/' + ndd + '/' + ny;
                    $("#time-startdate").datepicker("option", "maxDate", dtFormatted)
                    $('#time-enddaterequest').hide();
                    $('#time-enddate').datepicker("option", "minDate", ndtFormatted);
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
        

        this.$el.on('focusout', '#time-udecay', function(e) {
            if (/\d/.test($('#time-udecay').val()) && ($('#time-udecay').val())>0) {
                self.data.uDecay = parseInt($('#time-udecay').val());
                self.isValid.udecay = true;
                self.$('#time-udecaywarning').hide();
                self.$('#time-udecayrequest').hide();
            } else {
                self.$('#time-udecaywarning').show();
            }
        }.bind(this));

        this.$el.on('focusout', '#time-odecay', function(e) {
            if (/\d/.test($('#time-odecay').val()) && ($('#time-odecay').val())>0) {
                this.data.oDecay = parseInt($('#time-odecay').val());
                self.isValid.odecay = true;
                self.$('#time-odecaywarning').hide();
                self.$('#time-odecayrequest').hide();
            } else {
                self.$('#time-odecaywarning').show();
            }
        }.bind(this));

        this.$el.on('focusout', '#time-amount', function(e) {
            if (/^\d+(\.\d{1,2})?$/.test($('#time-amount').val())&& ($('#time-amount').val()>0) ) {
                this.data.timeamount = $('#time-amount').val();
                self.isValid.timeamount = true;
                self.$('#time-amountwarning').hide();
                self.$('#time-amountrequest').hide();
            } else {
                self.$('#time-amountwarning').show();
            }
        }.bind(this));

        
        this.$el.on('focusout', '#time-minDB', function(e) {
            if (/\d/.test($('#time-minDB').val()) && ($('#time-minDB').val())>=0) {
                this.data.minDB = parseInt($('#time-minDB').val());
                if (this.data.minDB == '') {
                    this.data.minDB = null;
                }
                if (this.data.minDB < 1) {
                    this.data.minDB = 0;
                    $('#time-minDB').prop('value', this.data.minDB);
                }

                if (this.data.minDB > this.data.maxDB) {
                    this.data.minDB = this.data.maxDB - 1;
                    $('#time-minDB').prop('value', this.data.minDB);
                    // $('#time-minDB').val(this.data.minDB);
                }
                self.isValid.minDB = true;
                self.$('#time-minDBwarning').hide();
                self.$('#time-minDBrequest').hide();
            } else {
                self.$('#time-minDBwarning').show();
            }
        }.bind(this));

        this.$el.on('focusout', '#time-maxDB', function(e) {
            if (/\d/.test($('#time-maxDB').val()) && ($('#time-maxDB').val())>=0) {
                this.data.maxDB = parseInt($('#time-maxDB').val());
                if (this.data.maxDB < 1) {
                    this.data.maxDB = 0;
                    $('#time-maxDB').prop('value', this.data.maxDB);
                }
                if (this.data.minDB > this.data.maxDB) {
                    this.data.maxDB = (this.data.minDB + 1);
                    $('#time-maxDB').prop('value', this.data.maxDB);
                    // $('#time-maxDB').val(this.data.maxDB);
                }
                self.isValid.maxDB = true;
                self.$('#time-maxDBwarning').hide();
                self.$('#time-maxDBrequest').hide();
            } else {
                self.$('#time-maxDBwarning').show();
            }
        }.bind(this));

        this.$el.on('click', '#time-myonoffswitch', function(e) {
            this.data.timeout = $('#time-myonoffswitch').prop('checked');
            this.isValid.timeout = true
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.UMTimeBudgetsView({
            timebudgets: timeBudgetCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.usageActivity.el);
        this.$el.append(this.groupUserServiceView.el);
        this.$el.append(this.costActivity.el);
        this.$el.append(this.modal.el);
    }
});