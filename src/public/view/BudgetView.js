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
            option: 'true'
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
            if(/^[a-z\d\-_\s]+$/i.test($('#budgetname').val())){
                $('#budgetnamewarning').hide();
                $('#budgetnamerequest').hide();
                var newBudget = true;
                for(var i=0;i<budgetCollection.length;++i){
                    if(budgetCollection.at(i).get('budgetName')==$('#budgetname').val()){
                        newBudget = false;
                    }
                }
                if(newBudget){
                    this.$('#oldbudgetnamewarning').hide();
                    this.data.budgetName = $('#budgetname').val();
                    self.isValid.budgetName = true;
                }else{
                    $('#oldbudgetnamewarning').show();
                }
            }else{
                $('#budgetnamewarning').show();
            } 
        }.bind(this));

        this.$el.on("change", '.costfilter', function(e) {
            var selected = $('.costfilter').val();
            $('#filter-details').removeClass('hidden');
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
            var datePicker = $("#startdate").datepicker({
                onSelect: function(dateText) {
                    self.data.startDate = this.value;
                    self.isValid.startDate = true;
                    self.$('#startdaterequest').hide();
                }
            });
            $("#myModal").scroll(function() {
                $("#startdate").datepicker("hide");
                $("#startdate").blur();
            });
        }.bind(this));

        this.$el.on('focusin', '#enddate', function(e) {
            var self = this;
            var datePicker = $("#enddate").datepicker({
                onSelect: function(dateText) {
                    if(this.value >= self.data.startDate){
                        self.data.endDate = this.value;
                        self.isValid.endDate = true;
                        self.$('#enddatewarning').hide();
                        self.$('#enddaterequest').hide();
                    }else{
                        self.$('#enddatewarning').show();
                    }
                }
            });
            $("#myModal").scroll(function() {
                $("#enddate").datepicker("hide");
                $("#enddate").blur();
            });
        }.bind(this));

        this.$el.on('focusout', '#amount', function(e) {
            if(/^\d+(\.\d{1,2})?$/.test($('#amount').val())){
                this.data.amount = parseInt($('#amount').val());
                self.isValid.amount = true;
                self.$('#amountwarning').hide();
                self.$('#amountrequest').hide();
            }else{
                self.$('#amountwarning').show();
            }
            
        }.bind(this));

        this.$el.on('click', '#myonoffswitch', function(e) {
            if ($('#myonoffswitch').val() == 'null') {
                $('#myonoffswitch').val('true');
            } else if ($('#myonoffswitch').val() == 'true') {
                var value = $('#myonoffswitch').val();
                $('#myonoffswitch').val('false');
                this.data.option = $('#myonoffswitch').val();
            } else {
                var value = $('#myonoffswitch').val();
                $('#myonoffswitch').val('true');
                this.data.option = $('#myonoffswitch').val();
            }

        }.bind(this));

        this.$el.on('click', '#savebtn', function(e) {
            if(self.data.batchType == null){
                self.$('#batchtyperequest').show();
            }
            if(self.data.batchName == null){
                self.$('#batchnamerequest').show();
            }
            if(self.data.budgetName == null){
                self.$('#budgetnamerequest').show();
            }
            if(self.data.amount == null){
                self.$('#amountrequest').show();
            }
            if(self.data.startDate == null){
                self.$('#startdaterequest').show();
            }
            if(self.data.endDate == null){
                self.$('#enddaterequest').show();
            }
            var validForm = true;
            for (var i in self.isValid) {
                if (!self.isValid[i]) {
                    validForm = false;
                }
            }
            $('#filter-details').addClass('hidden');
            if(validForm){
                this.model.post_budget_result(this.data);
                for (var i in self.isValid) {
                    self.isValid[i] = false;
                    self.data[i] = null;
                }
                $("#amount").val("");
                $("#budgetname").val("");
                $(".costfilter").val("");
                $("#startdate").val("");
                $("#enddate").val("");
                $('#myModal').modal('hide');
            }
        }.bind(this));

        this.$el.on('click', '#closebtn', function(e) {
            for(var i in self.isValid){
                self.isValid[i] = false;
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