var ConfigurationView = Backbone.View.extend({

    className: 'ConfigurationView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new ConfigurationModel();
        }
        this.bindings();
        this.render();
        this.data = {
            number : null,
            balance: 0,
            regions : [],
            s3BucketRegion: null,
            bucketName : null,
            URL: null,
            balanceExp: null,
            credutsUsed: null
        };

    },

    bindings: function() {
        this.model.change('openConfig', function(model, val) {
            this.render();
        }.bind(this));

        this.$el.on('click', '#saveConfig', function(e) {
            this.model.setExpiration(this.data.expiration);
            this.model.setCreditsUsed(this.data.used);
            this.model.setBalance(this.data.balance);
        }.bind(this));

        this.$el.on('focusout', '#expDate', function(e) {
            this.data.expiration = $('#expDate').val();

        }.bind(this));

        this.$el.on('focusout', '#myCredits', function(e) {
            this.data.balance = $('#myCredits').val();

        }.bind(this));

        this.$el.on('focusout', '#creditsUsed', function(e) {
            this.data.used = $('#creditsUsed').val();

        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.ConfigurationView({
            pages: ConfigurationCollection.toJSON(),
            aws: JSON.stringify(ConfigurationCollection.pluck('aws'))

        });
        this.$el.html(html);


    }
});