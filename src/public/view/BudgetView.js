//View for CostBudget creation
var daysToAdd = 1;
var BudgetView = Backbone.View.extend({
    className: 'BudgetView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.data = {
            budgetName: null,
            batchName: null,
            batchType: null,
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
        this.$('#batchNameAndTypeWarning').hide();
        this.$('#budgetnamewarning').hide();
        this.$('#budgetnamerequest').hide();
        this.$('#oldbudgetnamewarning').hide();
        this.$('#enddatewarning').hide();
        this.$('#enddaterequest').hide();
        this.$('#startdaterequest').hide();
        this.$('#amountwarning').hide();
        this.$('#amountrequest').hide();
        this.$('#batchtyperequest').hide();
        this.$('#batchnamerequest').hide();
    },

    bindings: function() {
        var self = this;
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
                } else {
                    $('#oldbudgetnamewarning').show();
                }
            } else {
                $('#budgetnamewarning').show();
            }
        }.bind(this));

        this.$el.on("change", '.costfilter', function(e) {
            var selected = $('.costfilter').val();
            this.$('.sub-costfilter').show();
            $('#filter-details').removeClass('hidden');
            if (selected == 'group') {
                self.model.getActiveGroups();
            } else {
                // self.model.getUsers();
                self.model.getActiveUsers();
            }
        }.bind(this));

        this.model.change('groupDataReady', function(model, val) {
            this.rerender(GroupCollection.toJSON());
        }.bind(this));

        this.model.change('userDataReady', function(model, val) {
            this.rerender(UserCollection.toJSON());
        }.bind(this));

        this.$el.on("change", '.sub-costfilter', function(e) {
            var selected = $('.sub-costfilter').val();
            this.data.batchName = selected;
            this.isValid.batchName = true;
            this.$('#batchnamerequest').hide();
        }.bind(this));

        this.$el.on("change", '.costfilter', function(e) {
            var selected = $('.costfilter').val();
            this.data.batchType = selected;
            this.isValid.batchType = true;
            this.$('#batchtyperequest').hide();
        }.bind(this));

        this.$el.on('focusin', '#startdate', function(e) {
            var self = this;
            // console.log("FOCUS IN startDate", self.data);
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
                    self.data.startDate = selected;
                    self.isValid.startDate = true;
                }
            });
        }.bind(this));

        this.$el.on('focusin', '#enddate', function(e) {
            var self = this;
            // console.log("FOCUS on endDate", self.data);
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
                        var sdd = dtMin.getDate();
                        var smm = dtMin.getMonth() + 1;
                        var sy = dtMin.getFullYear();
                        var sdtFormatted = smm + '/' + sdd + '/' + sy;
                        self.data.startDate = sdtFormatted;
                    }
                    self.data.endDate = selected;
                    self.isValid.endDate = true;
                }
            });
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

        this.$el.on('click', '#myonoffswitch', function(e) {
            this.data.timeout = $('#myonoffswitch').prop('checked');
            this.isValid.timeout = true
        }.bind(this));

        this.$el.on('click', '#savebtn', function(e) {
            // console.log("DATA about to be save (pre-check)", self.data);
            if (self.data.batchType == null) {
                self.$('#batchtyperequest').show();
            }
            if (self.data.batchName == null) {
                self.$('#batchnamerequest').show();
            }
            if (self.data.budgetName == null) {
                self.$('#budgetnamerequest').show();
            }
            if (self.data.amount == null) {
                self.$('#amountrequest').show();
            }
            if (self.data.startDate == null) {
                // console.log($('#startdate').val())
                self.$('#startdaterequest').show();
            }
            if (self.data.endDate == null) {
                // console.log($('#enddate').val())
                self.$('#enddaterequest').show();
            }
            if (self.data.timeout == null) {
                var checked = $('#myonoffswitch').prop('checked');
                if (checked) {
                    this.data.timeout = true;
                } else {
                    this.data.timeout = false;
                }
                this.isValid.timeout = true;
            }
            var validForm = true;

            for (var i in self.isValid) {
                if (!self.isValid[i]) {
                    validForm = false;
                    console.log("invalid");
                }
            }

            $('#filter-details').addClass('hidden');
            if (validForm) {
                console.log("form is valid");
                // console.log("About to pass to post budget result")
                this.model.post_budget_result(this.data, function(err) {
                    if (err == 'success') {
                        console.log("success");
                        for (var i in self.isValid) {
                            self.isValid[i] = false;
                            self.data[i] = null;
                            submitted = true;
                        }
                        $('#batchSelectionWarning').hide();
                        $("#amount").val("");
                        $("#budgetname").val("");
                        $(".costfilter").val("");
                        $("#startdate").val("");
                        $("#enddate").val("");
                        $('#myModal').modal('hide');
                    } else if (err == 'error, TimeBudget for batchName already Exists') {
                        //WHY is this being shown 
                        console.log("Please make a time budget for a user or group without one already");
                        this.$('#time-batchNameAndTypeWarning').show();
                    }
                });
            }
        }.bind(this));

        this.$el.on('click', '#closebtn', function(e) {
            for (var i in self.isValid) {
                self.isValid[i] = false
                self.data[i] = null;
            }
            $("#amount").val("");
            $("#budgetname").val("");
            $(".costfilter").val("");
            $("#startdate").val("");
            $("#enddate").val("");
            $('#filter-details').addClass('hidden');
            $('#myModal').modal('hide');
        }.bind(this));

        this.$el.on('click', '.close', function(e) {
            for (var i in self.isValid) {
                self.isValid[i] = false
                self.data[i] = null;
            }
            $("#amount").val("");
            $("#budgetname").val("");
            $(".costfilter").val("");
            $("#startdate").val("");
            $("#enddate").val("");
            $('#filter-details').addClass('hidden');
            $('#myModal').modal('hide');
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.BudgetView({

        });
        this.$el.html(html);
    },

    rerender: function(collection) {
        var html = Handlebars.templates.BudgetView({
            col: collection
        });
        var selector = '.sub-costfilter';
        this.$el.find(selector).replaceWith($(selector, html));
    }
});