var NotificationView = Backbone.View.extend({

    className: 'NotificationView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new NotificationModel();
        }
        setInterval(this.model.getNotification(),1000*6);
        this.bindings();
    },


    bindings: function() {
        this.$el.on("click", '.notify', function(e) {
            console.log('notification clicked')
        }.bind(this));


        this.model.change('isOpen', function(model, val) {
            var toggle = val ? 'addClass' : 'removeClass';
            this.$el[toggle]('visible');

            if(this.model.isOpen == true) {
                console.log('the budget is open');
                
            }

        }.bind(this));

        this.model.change('dataReady', function(model, val) {
            console.log("rendering");
            this.render();
        }.bind(this));

    },

    render: function() {
        var html = Handlebars.templates.NotificationView({
            notifications: notificationCollection.toJSON()
        });
        this.$el.html(html);
    }
});