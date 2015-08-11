var TimeBudgetView = Backbone.View.extend({
    className: 'TimeBudgetView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.data = {
            timebudgetname: null,
            batchName: null,
            batchType: null,
            startDate: null,
            endDate: null,
            timeamount: null,
            udecay: null,
            odecay: null,
            minDBConnections: null,
            maxDBConnections: null,
            option: 'true'
        };
        this.isValid = {
            timebudgetname: false,
            batchName: false,
            batchType: false,
            startDate: false,
            endDate: false,
            timeamount: false,
            udecay: false,
            odecay: false,
            minDBConnections: false,
            maxDBConnections: false,
        };
        this.bindings();
        this.render();
        this.$('#time-mindbconnectionswarning').hide();
        this.$('#time-mindbconnectionsrequest').hide();
        this.$('#time-maxdbconnectionswarning').hide();
        this.$('#time-maxdbconnectionsrequest').hide();
        this.$('#time-odecaywarning').hide();
        this.$('#time-odecayrequest').hide();
        this.$('#time-udecaywarning').hide();
        this.$('#time-udecayrequest').hide();
        this.$('#time-budgetnamewarning').hide();
        this.$('#time-budgetnamerequest').hide();
        this.$('#time-oldbudgetnamewarning').hide();
        this.$('#time-enddatewarning').hide();
        this.$('#time-enddaterequest').hide();
        this.$('#time-startdaterequest').hide();
        this.$('#time-amountwarning').hide();
        this.$('#time-amountrequest').hide();
        this.$('#time-batchtyperequest').hide();
        this.$('#time-batchnamerequest').hide();
    },

    bindings: function() {
        var self = this;
        this.$el.on('focusout', '#time-budgetname', function(e) {
            if (/^[a-z\d\-_\s]+$/i.test($('#time-budgetname').val())) {
                $('#time-budgetnamewarning').hide();
                $('#time-budgetnamerequest').hide();
                var newBudget = true;
                console.log(timeBudgetCollection)
                for (var i = 0; i < timeBudgetCollection.length; ++i) {
                    if (timeBudgetCollection.at(i).get('timeBudgetName') == $('#time-budgetname').val()) {
                        newBudget = false;
                    }
                }
                if (newBudget) {
                    this.$('#time-oldbudgetnamewarning').hide();
                    this.data.timebudgetname = $('#time-budgetname').val();
                    self.isValid.timebudgetname = true;
                } else {
                    $('#time-oldbudgetnamewarning').show();
                }
            } else {
                $('#time-budgetnamewarning').show();
            }
        }.bind(this));

        this.$el.on("change", '.time-costfilter', function(e) {
            var selected = $('.time-costfilter').val();
            $('#time-filter-details').removeClass('hidden');
            if (selected == 'group') {
                self.model.getGroups();
            } else {
                self.model.getUsers();
            }
        }.bind(this));

        this.model.change('groupDataReady', function(model, val) {
            this.rerender(GroupCollection.toJSON());
        }.bind(this));

        this.model.change('userDataReady', function(model, val) {
            this.rerender(UserCollection.toJSON());
        }.bind(this));

        this.$el.on("change", '.time-sub-costfilter', function(e) {
            var selected = $('.time-sub-costfilter').val();
            this.data.batchName = selected;
            this.isValid.batchName = true;
            this.$('#time-batchnamerequest').hide();
        }.bind(this));

        this.$el.on("change", '.time-costfilter', function(e) {
            var selected = $('.time-costfilter').val();
            this.data.batchType = selected;
            this.isValid.batchType = true;
            this.$('#time-batchtyperequest').hide();
        }.bind(this));

        this.$el.on('focusin', '#time-startdate', function(e) {
            var self = this;
            // console.log("FOCUS IN startDate", self.data);
            var datePicker = $("#time-startdate").datepicker({
                onSelect: function(dateText) {
                    if (self.data.endDate === null || self.data.endDate == "") {
                        self.data.startDate = this.value;
                        self.isValid.startDate = true;
                            console.log("No End Date");
                        self.$('#time-startdaterequest').hide();
                    } else {
                        var startD, startM, startY;
                        var endD, endM, endY;
                        startD = this.value.substr(3, 2);
                        startM = this.value.substr(0, 2);
                        startY = this.value.substr(6, 4);
                        var start = new Date(startY, startM - 1, startD);
                        endD = self.data.endDate.substr(3, 2);
                        endM = self.data.endDate.substr(0, 2);
                        endY = self.data.endDate.substr(6, 4);
                        var end = new Date(endY, endM - 1, endD);
                        console.log("From", start, "\nto", end);
                        if (end > start) {
                            console.log("valid date range");
                            self.data.endDate = this.value;
                            self.isValid.endDate = true;
                            self.$('#time-enddatewarning').hide();
                            self.$('#time-enddaterequest').hide();
                        } else {
                            console.log("invalid date range")
                            self.$('#time-enddatewarning').show();
                        }
                    }
                }
            });
            $("#timeBudgetModal").scroll(function() {
                $("#time-startdate").datepicker("hide");
                $("#time-startdate").blur();
            });
        }.bind(this));

        this.$el.on('focusout', '#time-startdate', function(e) {
            if (self.data.endDate > self.data.startDate) {
                console.log("valid date range");
                self.data.endDate = this.value;
                self.isValid.endDate = true;
                self.$('#time-enddatewarning').hide();
                self.$('#time-enddaterequest').hide();
            }
            self = this;
            this.data.startDate = ($('#time-startdate').val());
            console.log("FOCUS OUT startDate", self.data);
        }.bind(this));

        this.$el.on('focusin', '#time-enddate', function(e) {
            var self = this;
            console.log("FOCUS on endDate", self.data);
            var datePicker = $("#time-enddate").datepicker({
                onSelect: function(dateText) {
                    if (self.data.startDate == null) {
                        self.data.startDate = this.value;
                        self.isValid.startDate = true;
                        self.$('#time-startdaterequest').hide();
                    } else if (self.data.startDate != null) {
                        var startD, startM, startY;
                        var endD, endM, endY;
                        startD = self.data.startDate.substr(3, 2);
                        startM = self.data.startDate.substr(0, 2);
                        startY = self.data.startDate.substr(6, 4);
                        var start = new Date(startY, startM - 1, startD);
                        endD = this.value.substr(3, 2);
                        endM = this.value.substr(0, 2);
                        endY = this.value.substr(6, 4);
                        var end = new Date(endY, endM - 1, endD);
                        console.log("From", start, "to", end);
                        if (end > start) {
                            console.log("valid date range");
                            self.data.endDate = this.value;
                            self.isValid.endDate = true;
                            self.$('#time-enddatewarning').hide();
                            self.$('#time-enddaterequest').hide();
                        } else {
                            console.log("invalid date range")
                            self.$('#time-enddatewarning').show();
                        }
                    }
                }
            });
            $("#timeBudgetModal").scroll(function() {
                $("#time-enddate").datepicker("hide");
                $("#time-enddate").blur();
            });
        }.bind(this));

        this.$el.on('focusout', '#time-enddate', function(e) {
            self = this;
            this.data.endDate = ($('#time-enddate').val());
            console.log("enddate is ", this.data);
        }.bind(this));

        this.$el.on('focusout', '#time-amount', function(e) {
            if (/^\d+(\.\d{1,2})?$/.test($('#time-amount').val())) {
                this.data.timeamount = $('#time-amount').val();
                self.isValid.timeamount = true;
                self.$('#time-amountwarning').hide();
                self.$('#time-amountrequest').hide();
            } else {
                self.$('#time-amountwarning').show();
            }

        }.bind(this));

        this.$el.on('focusout', '#time-udecay', function(e) {
            if (/\d/.test($('#time-udecay').val())) {
                this.data.udecay = parseInt($('#time-udecay').val());
                self.isValid.udecay = true;
                self.$('#time-udecaywarning').hide();
                self.$('#time-udecayrequest').hide();
            } else {
                self.$('#time-udecaywarning').show();
            }

        }.bind(this));

        this.$el.on('focusout', '#time-odecay', function(e) {
            if (/\d/.test($('#time-odecay').val())) {
                this.data.odecay = parseInt($('#time-odecay').val());
                self.isValid.odecay = true;
                self.$('#time-odecaywarning').hide();
                self.$('#time-odecayrequest').hide();
            } else {
                self.$('#time-odecaywarning').show();
            }

        }.bind(this));

        this.$el.on('focusout', '#time-dbconnections', function(e) {
            if (/\d/.test($('#time-dbconnections').val())) {
                this.data.dbConnections = parseInt($('#time-dbconnections').val());
                self.isValid.maxDBConnections = true;
                self.$('#time-maxdbconnectionswarning').hide();
                self.$('#time-maxdbconnectionsrequest').hide();
            } else {
                self.$('#time-maxdbconnectionswarning').show();
            }

        }.bind(this));

        this.$el.on('focusout', '#time-mindbconnections', function(e) {
            if (/\d/.test($('#time-mindbconnections').val())) {
                this.data.dbConnections = parseInt($('#time-mindbconnections').val());
                self.isValid.minDBConnections = true;
                self.$('#time-mindbconnectionswarning').hide();
                self.$('#time-mindbconnectionsrequest').hide();
            } else {
                self.$('#time-mindbconnectionswarning').show();
            }

        }.bind(this));


        this.$el.on('click', '#time-myonoffswitch', function(e) {
            if ($('#time-myonoffswitch').val() == 'null') {
                $('#time-myonoffswitch').val('true');
            } else if ($('#time-myonoffswitch').val() == 'true') {
                var value = $('#time-myonoffswitch').val();
                $('#time-myonoffswitch').val('false');
                this.data.option = $('#time-myonoffswitch').val();
            } else {
                var value = $('#time-myonoffswitch').val();
                $('#time-myonoffswitch').val('true');
                this.data.option = $('#time-myonoffswitch').val();
            }

        }.bind(this));

        this.$el.on('click', '#time-savebtn', function(e) {
            if (self.data.timebudgetname == null) {
                self.$('#time-budgetnamerequest').show();
            }
            if (self.data.batchType == null) {
                self.$('#time-batchtyperequest').show();
            }
            if (self.data.batchName == null) {
                self.$('#time-batchnamerequest').show();
            }
            if (self.data.startDate == null) {
                self.$('#time-startdaterequest').show();
            }
            if (self.data.endDate == null) {
                self.$('#time-enddaterequest').show();
            }
            if (self.data.timeamount == null) {
                self.$('#time-amountrequest').show();
            }
            if (self.data.udecay == null) {
                self.$('#time-udecayrequest').show();
            }
            if (self.data.odecay == null) {
                self.$('#time-odecayrequest').show();
            }
            if (self.data.minDBConnections == null) {
                self.$('#time-mindbconnectionsrequest').show();
            }
            if (self.data.maxDBConnections == null) {
                self.$('#time-maxdbconnectionsrequest').show();
            }
            $('#time-filter-details').addClass('hidden');
            var validForm = true;
            for (var i in self.isValid) {
                if (!self.isValid[i]) {
                    validForm = false;
                }
            }
            if (validForm) {
                this.model.post_time_budget_result(this.data);
                for (var i in self.isValid) {
                    self.isValid[i] = false;
                    self.data[i] = null;
                }
                $("#time-amount").val("");
                $("#time-budgetname").val("");
                $(".time-costfilter").val("");
                $("#time-startdate").val("");
                $("#time-enddate").val("");
                $("#time-udecay").val("");
                $("#time-odecay").val("");
                $('#timeBudgetModal').modal('hide');
            }
        }.bind(this));

        this.$el.on('click', '#time-closebtn', function(e) {
            for (var i in self.isValid) {
                self.isValid[i] = false;
                self.data[i] = null;
            }
            $("#time-amount").val("");
            $("#time-budgetname").val("");
            $(".time-costfilter").val("");
            $("#time-startdate").val("");
            $("#time-enddate").val("");
            $("#time-udecay").val("");
            $("#time-odecay").val("");
            $('#time-filter-details').addClass('hidden');
            $('#timeBudgetModal').modal('hide');
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.TimeBudgetView;
        this.$el.html(html);
    },

    rerender: function(collection) {
        var html = Handlebars.templates.TimeBudgetView({
            col: collection
        });
        var selector = '.time-sub-costfilter';
        this.$el.find(selector).replaceWith($(selector, html));
    }
});