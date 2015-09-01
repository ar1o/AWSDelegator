var MeterView = Backbone.View.extend({

    className: 'MeterView',

    initialize: function(options) {
        if (!this.model) this.model = new MeterModel();
        setInterval(this.model.getMeterValues(), 1000 * 20);
        this.bindings();
        this.render();
    },

    bindings: function() {

        this.model.change('rateDataReady', function(model, val) {
            // console.log('rateDataReady');
            this.render();
        }.bind(this));

        this.model.change('usageDataReady', function(model, val) {
            // console.log('usageDataReady');
            this.render();
        }.bind(this));

        this.model.change('balanceDataReady', function(model, val) {
            // console.log('balanceDataReady');
            this.render();
        }.bind(this));


    },

    render: function() {
        var html = Handlebars.templates.MeterView({
            rate: usageRateCollection.toJSON(),
            usage: usageCollection.toJSON(),
            balance: creditBalanceCollection.toJSON()
        });
        // var html = Handlebars.templates.MeterView;
        this.$el.html(html);
    }
});