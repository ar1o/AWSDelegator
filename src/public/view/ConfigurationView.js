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
            // console.log(ConfigurationCollection)
            this.render();
        }.bind(this));

        // this.$el.on('focusout', '#myCredits', function(e){
        //  var self = this;
        //      console.log($(input:mdl-textfield[id=myCredits]).val());            
        // }).bind(this);
        this.$el.on('click', '#saveConfig', function(e) {
            // console.log("save (config) button clicked");
            // console.log(this.data);
            // console.log("bal",this.data.balance);
            // console.log("exp",this.data.expiration);
            this.model.setExpiration(this.data.expiration);
            this.model.setBalance(this.data.balance);
            this.model.setCreditsUsed(this.data.used);
        }.bind(this));

        this.$el.on('focusout', '#expDate', function(e) {
            // console.log("expiration clicked", $('#expDate').val());
            this.data.expiration = $('#expDate').val();
        }.bind(this));

        this.$el.on('focusout', '#myCredits', function(e) {
            // console.log("credits clicked", $('#myCredits').val());
            this.data.balance = $('#myCredits').val();
        }.bind(this));

        this.$el.on('focusout', '#creditsUsed', function(e) {
            // console.log("creditsUsed clicked", $('#creditsUsed').val());
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