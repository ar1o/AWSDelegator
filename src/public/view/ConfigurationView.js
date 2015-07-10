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
            balanceExp: null
        };

    },

    bindings: function() {
        this.model.change('openConfig', function(model, val) {
            console.log(ConfigurationCollection)
            this.render();
        }.bind(this));

        // this.$el.on('focusout', '#myCredits', function(e){
        //  var self = this;
        //      console.log($(input:mdl-textfield[id=myCredits]).val());            
        // }).bind(this);



    },

    render: function() {
        var html = Handlebars.templates.ConfigurationView({
            pages: ConfigurationCollection.toJSON(),
            aws: JSON.stringify(ConfigurationCollection.pluck('aws'))

        });
        this.$el.html(html);


    }
});