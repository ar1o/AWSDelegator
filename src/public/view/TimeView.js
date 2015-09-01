var TimeView = Backbone.View.extend({

    className: 'TimeView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new TimeModel();
        }
        var self = this;
        var time;
        this.model.getLatestTime(function(value){
            // console.log(value);
            self.time = value;
            self.render();
        });

        // this.meterActivity = new MeterView();
        // // this.budgetView = new BudgetView();
        // this.bindings();
        // this.render();
    },


    bindings: function() {
    },

    render: function() {
        var html = Handlebars.templates.TimeView({
            time: this.time
        });        
        // var html = Handlebars.templates.HeaderView;        
        this.$el.html(html);

        // this.$el.append(this.meterActivity.el);       
        // // this.$el.append(this.budgetView.el);       
    }
});