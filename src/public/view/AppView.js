var AppView = Backbone.View.extend({
    /* run render, bind and initialize other views */
    initialize: function(options) {
        AppView.sharedInstance = this;
        var self = this;

        this.header = new HeaderView();
        this.navView = new NavView();
        this.latestTime = new TimeView();
        this.budgetView = new BudgetView();
        this.timeBudgetView = new TimeBudgetView();
        this.configurationView = new ConfigurationView();
        this.notificationView = new NotificationView();

        this.timeBudgetView.model.getTimeBudgets();
        this.footer = new FooterView();

        this.router = new AppRouter({
            defaultView: 'AWSView'
        });

        this.bindings();
        this.render();
        this.setListeners();

        $('.content-view').append(this.latestTime.el);
        $('.content-view').append(this.footer.el);

        // content view that holds all the content heigh calculation
        window_size = $(window).height();
        var length_calc = (window_size - 50);
        var length = length_calc + 'px';
        this.$('.content-view').css({
            'height': length
        });

        $(window).resize(function() {
            window_size = $(window).height();
            var length_calc = (window_size - 50);
            var length = length_calc + 'px';
            this.$('.content-view').css({
                'height': length
            });
        });
    },

    setListeners: function() {
        var self = this;
        // url changes drive location within the app
        this.router.on("change:view", function(a, view) {
            self.setView(view);
        });
        var prevArgs = {};
        this.router.on('change:args', function(a, args) {
            var currentView = self.model.get('currentView');
            if (currentView.updateArguments) {
                var changeView = currentView.updateArguments(args, prevArgs);
                prevArgs = args;
                if (!changeView) {
                    setTimeout(function() {
                        var view = self.router.get('view');
                        self.setView(view);
                    }, 100);
                }
            }
        });
    },

    /* make our view listen to user events */
    bindings: function() {
        // for displaying tooltips
        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        // user clicks on the menu icon should open the nav view
        this.$el.on("click", '.menu', function(e) {
            if (this.navView.model.isOpen == true) {
                this.navView.model.isOpen = false;
            } else {
                this.navView.model.isOpen = true;
                window_size = $(window).height();
                var length_calc = (window_size);
                var length = length_calc + 'px';
                this.$('.NavView').css({
                    'height': length
                });
            }
        }.bind(this));

        // users mouse hovers the menu icon should open the nav view
        this.$el.on("mouseenter", '.menu', function(e) {
            this.navView.model.isOpen = true;
            window_size = $(window).height();
            var length_calc = (window_size);
            var length = length_calc + 'px';
            this.$('.NavView').css({
                'height': length
            });
        }.bind(this));

        // users mouse is on the nav view it should be kept open
        this.$el.on("mouseenter", '.NavView', function(e) {
            this.navView.model.isOpen = true;
        }.bind(this));

        //users mouse leaves the nav view it should close
        this.$el.on("mouseleave", '.NavView', function(e) {
            this.navView.model.isOpen = false;
        }.bind(this));

        // users mouse leaves the menu icon it should close
        this.$el.on("mouseleave", '.menu', function(e) {
            this.navView.model.isOpen = false;
        }.bind(this));

        // this does nothing
        this.$el.on("click", '.setting', function(e) {}.bind(this));

        // handle nav view clicks
        this.$el.on('click', '[page-id="0"]', function(e) {
            this.navView.model.isOpen = false;
            window.location.hash = '#/AWS';
        }.bind(this));

        this.$el.on('click', '[page-id="1"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/EC2';
        }.bind(this));

        this.$el.on('click', '[page-id="2"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/RDS';
        }.bind(this));

        this.$el.on('click', '[page-id="3"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/IAM';
        }.bind(this));

        this.$el.on('click', '[page-id="4"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/UsageMonitor';
        }.bind(this));

        this.$el.on('click', '[subpage-id="0"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/EC2Instances';
        }.bind(this));

        this.$el.on('click', '[subpage-id="1"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/RDSInstances';
        }.bind(this));

        this.$el.on('click', '[subpage-id="2"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/UMCostBudgets';
        }.bind(this));

        this.$el.on('click', '[subpage-id="3"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/UMTimeBudgets';
        }.bind(this));
        // end of handling nav view clicks

        // user clicks notification icon should open the notification view
        this.$el.on("click", '.notify', function(e) {
            if (this.notificationView.model.isOpen == false) {
                this.notificationView.model.isOpen = true;
            } else {
                this.notificationView.model.isOpen = false;
            }
        }.bind(this));

        // the notification view badge should be update according to the notificaiton available
        this.notificationView.model.change('dataReady', function(model, val) {
            if (this.notificationView.model.getSeenNumber() == 0) {
                this.$(".mdl-badge").removeAttr("data-badge");
            } else {
                this.$(".mdl-badge").attr("data-badge", this.notificationView.model.getSeenNumber());
            }
        }.bind(this));

    },

    /* render the app view */
    render: function() {
        this.$el.html(Handlebars.templates.AppView({
            time: this.time
        }));
        this.$el.append(this.header.el);
        this.$el.append(this.navView.el);
        this.$el.append(this.configurationView.el);
        this.$el.append(this.budgetView.el);
        this.$el.append(this.timeBudgetView.el);
        this.$el.append(this.notificationView.el);

        this.setView(this.router.get('view'));
    },

    /* set the corresponding view and destroy the old view on hash changes */
    setView: function(view) {
        var args = this.router.get('args');
        args.parentView = this;
        var viewInstance = new view(args);
        var oldView = this.model.get('currentView');
        if (oldView && oldView.destroy)
            oldView.destroy(viewInstance);
        this.model.set('currentView', viewInstance);
        this.$el.find('.content-view').html(viewInstance.el);
        $('.content-view').append(this.footer.el);
        $('.content-view').append(this.latestTime.el);
    }

});