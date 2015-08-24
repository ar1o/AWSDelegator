var NotificationView = Backbone.View.extend({

    className: 'NotificationView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new NotificationModel();
        }
        var self = this;
        self.model.getNotification();
        setInterval(function() {
            self.model.getNotification();
        }, 1000 * 60 * 60);
        // }, 1000 * 6);

        this.bindings();
    },

    bindings: function() {
        this.$el.on("click", '.notify-data', function(e) {
            if (this.model.isOpen == true) {
                var clicked = e.target
                var currentID = clicked.id
                console.log('currentID clicked', currentID);
                //Set notification as seen 
                if (this.model.isSeen(currentID) == false) {
                    this.model.setAsSeen(currentID);
                }
                //open usage monitor
                window.location.hash = '#/UsageMonitor';
                setTimeout(function() {
                    $('#BudgetTable tr').each(function() {
                        var str = ('#' + currentID);
                        var id = $(this).find(str).html();
                        if (typeof(id) != "undefined") {
                            $('#' + id).click();
                        }
                    });
                }, 200);
            }
        }.bind(this));



        this.model.change('isOpen', function(model, val) {
            var toggle = val ? 'addClass' : 'removeClass';
            this.$el[toggle]('visible');
        }.bind(this));

        this.model.change('dataReady', function(model, val) {
            this.render();
        }.bind(this));

        var self = this;
        $("body").mouseup(function(e) {
            if (e.target.className == 'fa fa-bell fa-1x') {
                //do nothing
            } else if (e.target.className == "notify") {
                //do nothing
            } else {
                self.model.isOpen = false;
            }
        });

    },

    render: function() {
        var html = Handlebars.templates.NotificationView({
            notifications: notificationCollection.toJSON()
        });
        this.$el.html(html);
        this.changeBackground();
    },

    changeBackground: function() {
        for (var i = 0; i < notificationCollection.length; i++) {
            var id = '#' + notificationCollection.at(i).get('notification');
            if (notificationCollection.at(i).get('seen') == 'false') {
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