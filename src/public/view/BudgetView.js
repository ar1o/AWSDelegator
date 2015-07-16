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
        this.validify = {
            budgetName: false,
            batchType: false,
            batchName: false,
            startDate: false,
            endDate: false,
            amount: false
        };
        var collection;
        this.bindings();
        this.render();
        // this.model.getBudgets();
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

    render_collection: function(collection) {
        if (collection == 'Groups') {
            this.model.getGroups();
        } else {
            this.model.getUsers();
        }
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
                    self.validify.budgetName = true;
                }else{
                    console.log($('#budgetname').val())
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
                this.render_collection('Groups')
            } else {
                this.render_collection('Users')
            }
        }.bind(this));

        this.model.change('groupDataReady', function(model, val) {
            this.collection = GroupCollection.toJSON();
            this.rerender();
        }.bind(this));

        this.model.change('userDataReady', function(model, val) {
            this.collection = UserCollection.toJSON();
            this.rerender();
        }.bind(this));

        this.$el.on("change", '.sub-costfilter', function(e) {
            var selected = $('.sub-costfilter').val();
            this.data.batchName = selected;
            this.validify.batchName = true;
            this.$('#batchnamerequest').hide();
        }.bind(this));

        this.$el.on("change", '.costfilter', function(e) {
            var selected = $('.costfilter').val();
            this.data.batchType = selected;
            this.validify.batchType = true;
            this.$('#batchtyperequest').hide();
        }.bind(this));

        this.$el.on('focusin', '#startdate', function(e) {
            var self = this;
            var datePicker = $("#startdate").datepicker({
                onSelect: function(dateText) {
                    self.data.startDate = this.value;
                    self.validify.startDate = true;
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
                    if(self.data.endDate >= self.data.startDate){
                        self.data.endDate = this.value;
                        self.validify.endDate = true;
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
                this.data.amount = $('#amount').val();
                self.validify.amount = true;
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
            if(self.data.budgetname == null){
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
            for(var i in self.validify){
                if(!self.validify[i]){ 
                    validForm = false;
                }
            }
            if(validForm){
                $('#myModal').modal('hide');
                this.model.post_budget_result(this.data);
            }
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.BudgetView({

        });
        this.$el.html(html);
    },
    rerender: function() {
        var html = Handlebars.templates.BudgetView({
            col: this.collection
        });
        var selector = '.sub-costfilter';
        this.$el.find(selector).replaceWith($(selector, html));
    }
});