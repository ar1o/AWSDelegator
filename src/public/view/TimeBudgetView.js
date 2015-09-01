/*View for Timebudget creation*/

var daysToAdd = 1;
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
            minDB: null,
            maxDB: null,
            timeout: true
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
            minDB: false,
            maxDB: false,
            timeout: true
        };
        this.bindings();
        this.render();
        this.$('#time-associationWarning').hide()
        this.$('#time-batchNameAndTypeWarning').hide();
        this.$('#time-batchSelectionWarning').hide();
        this.$('#time-minDBwarning').hide();
        this.$('#time-minDBrequest').hide();
        this.$('#time-maxDBwarning').hide();
        this.$('#time-maxDBrequest').hide();
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
                self.model.getActiveGroups();
            } else if( selected =='user') {
                self.model.getActiveUsers();
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
            // console.log("FOCUS on endDate", self.data);
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
                    $('#time-startdate').datepicker("option", "maxDate", dtFormatted)
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
                        var sdd = dtMin.getDate();
                        var smm = dtMin.getMonth() + 1;
                        var sy = dtMin.getFullYear();
                        var sdtFormatted = smm + '/' + sdd + '/' + sy;
                        self.data.startDate = sdtFormatted;
                    }
                    self.data.endDate = selected;
                    self.isValid.endDate = true;
                    //Prevent endDate from being less than now:

                    // if(ey < ny || ey == ny && emm < nmm ||ey == ny && emm == nmm && edd < ndd){

                    //     self.data.endDate = 
                    // }
                }
            });

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

        this.$el.on('focusout', '#time-udecay', function(e) {
            if (/\d/.test($('#time-udecay').val()) && ($('#time-udecay').val())>0) {
                this.data.udecay = parseInt($('#time-udecay').val());
                self.isValid.udecay = true;
                self.$('#time-udecaywarning').hide();
                self.$('#time-udecayrequest').hide();
            } else {
                self.$('#time-udecaywarning').show();
            }
        }.bind(this));

        this.$el.on('focusout', '#time-odecay', function(e) {
            if (/\d/.test($('#time-odecay').val()) && ($('#time-odecay').val())>0) {
                this.data.odecay = parseInt($('#time-odecay').val());
                self.isValid.odecay = true;
                self.$('#time-odecaywarning').hide();
                self.$('#time-odecayrequest').hide();
            } else {
                self.$('#time-odecaywarning').show();
            }
        }.bind(this));

        this.$el.on('focusout', '#time-minDB', function(e) {
            if (/\d/.test($('#time-minDB').val()) && ($('#time-minDB').val())>=0) {
                this.data.minDB = parseInt($('#time-minDB').val());
                console.log(this.data.minDB, this.data.maxDB);
                if (this.data.minDB == '') {
                    console.log('no text');
                    this.data.minDB = null;
                }
                if (this.data.minDB < 1) {
                    this.data.minDB = 0;
                    $('#time-minDB').prop('value', this.data.minDB);
                }

                if (this.data.minDB > this.data.maxDB && this.data.maxDB != null) {
                    console.log("minDB > max");
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
                console.log(this.data.minDB, this.data.maxDB);
                if (this.data.maxDB < 1) {
                    this.data.maxDB = 0;
                    $('#time-maxDB').prop('value', this.data.maxDB);
                }
                if (this.data.minDB > this.data.maxDB && this.data.minDB != null) {
                    console.log("minDB > max");
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

        this.$el.on('click', '#time-savebtn', function(e) {
            console.log("DATA about to be save (pre-check)", self.data);
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
            if (self.data.uDecay == null) {
                self.$('#time-udecayrequest').show();
            }
            if (self.data.oDecay == null) {
                self.$('#time-odecayrequest').show();
            }
            if (self.data.minDB == null) {
                self.$('#time-minDBrequest').show();
            }
            if (self.data.maxDB == null) {
                self.$('#time-maxDBrequest').show();
            }
            if (self.data.timeout == null) {
                var checked = $('#time-myonoffswitch').prop('checked');
                if (checked) {
                    this.data.timeout = true;
                } else {
                    this.data.timeout = false;
                }
                this.isValid.timeout = true;
            }
            // $('#time-filter-details').addClass('hidden');
            var validForm = true;

            for (var i in self.isValid) {
                if (!self.isValid[i]) {
                    validForm = false;
                    console.log("invalid", i);
                }
            }

            if (validForm) {
                console.log("form is valid");
                this.model.post_time_budget_result(this.data, function(err) {
                    if (err == 'success') {
                        console.log("success");
                        for (var i in self.isValid) {
                            self.isValid[i] = false;
                            self.data[i] = null;
                            submitted = true;
                        }
                        $('#time-batchSelectionWarning').hide();
                        $("#time-amount").val("");
                        $("#time-budgetname").val("");
                        $(".time-costfilter").val("");
                        $(".time-sub-costfilter").val("");
                        $("#time-startdate").val("");
                        $("#time-enddate").val("");
                        $("#time-udecay").val("");
                        $("#time-odecay").val("");
                        $("#minDB").val("");
                        $("#maxDB").val("");
                        $(".time-sub-costfilter").hide();
                        $('#timeBudgetModal').modal('hide');

                    }
                    else if (err == 'error, TimeBudget for batchName already Exists'){
                        console.log("Please make a time budget for a user or group without one already");
                        this.$('#time-batchNameAndTypeWarning').show();
                        this.$('#time-associationWarning').hide()
                        this.$('#time-batchSelectionWarning').hide();
                    }
                    else if ( err == 'error: no associated resources'){
                        console.log('It seems like the selected user or group does not an associated instance')
                        this.$('#time-associationWarning').show()
                    }
                    else if (err == 'error: empty response'){
                        console.log('empty response');
                    }
                    else if (err == '') {
                        // console.log('text is',err);
                        // console.log('time budget insert error');
                        this.$('#time-associationWarning').hide()
                        this.$('#time-batchNameAndTypeWarning').hide();
                        this.$('#time-batchSelectionWarning').hide();
                    }
                });
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
            $(".time-sub-costfilter").val("");
            $(".time-sub-costfilter").hide();
            $("#time-startdate").val("");
            $("#time-enddate").val("");
            $("#time-udecay").val("");
            $("#time-odecay").val("");
            $("#minDB").val("");
            $("#maxDB").val("");
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