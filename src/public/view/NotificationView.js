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
            this.render(function() {
                self.changeBackground();
            });
        }.bind(this));

        var self = this;
        $("body").mouseup(function(e) {
            if (e.target.className == 'fa fa-bell fa-1x') {
                //do nothing
            } else if (e.target.className == "notify" || e.target.className == "notify-data") {
                //do nothing
            } else {
                self.model.isOpen = false;
            }
        });

    },

    render: function(callback) {
        var html = Handlebars.templates.NotificationView({
            notifications: notificationCollection.toJSON()
        });
        this.$el.html(html);
        callback();
    },

    changeBackground: function() {
        var index = 0;
        var budgetController = function() {
            budgetIterator(function() {
                index++;
                if (index < notificationCollection.length) {
                    budgetController();
                }
            });
        };
        var budgetIterator = function(callback1) {
            var id = '#' + notificationCollection.at(index).get('notification');

            if (notificationCollection.at(index).get('seen') == 'false') {
                this.$(id).css({
                    'background': 'white'
                });
                callback1();
            } else {
                this.$(id).css({
                    'background': '#f7f7f7'
                });
                callback1();
            }
        };
        if(notificationCollection.length != 0) {
            budgetController();
        }
    }


});