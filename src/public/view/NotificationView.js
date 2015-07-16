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
        this.$el.on("click", '.notify-data', function(e) {
            if(this.model.isOpen == true) {
                var clicked = e.target
                var currentID = clicked.id
                console.log('currentID clicked',currentID);
                //Set notification as seen 
                this.model.setAsSeen(currentID);
            }
        }.bind(this));


        this.model.change('isOpen', function(model, val) {
            var toggle = val ? 'addClass' : 'removeClass';
            this.$el[toggle]('visible');
        }.bind(this));

        this.model.change('dataReady', function(model, val) {
            this.render();
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.NotificationView({
            notifications: notificationCollection.toJSON()
        });
        this.$el.html(html);
        this.changeBackground();
    },

    changeBackground: function() {
        for(var i = 0; i < notificationCollection.length; i++) {
            var id = '#'+notificationCollection.at(i).get('notification');
            if(notificationCollection.at(i).get('seen') == 'false') {
                this.$(id).css({
                    'background': 'white'
                });
            } else {
                this.$(id).css({
                    'background': '#f7f7f7'
                });
            }
        }
    }


});













