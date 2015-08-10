var AppView = Backbone.View.extend({

    initialize: function(options) {
        AppView.sharedInstance = this;
        var self = this;

        this.header = new HeaderView();
        this.navView = new NavView();
        // this.meterActivity = new MeterView();
        this.latestTime = new TimeView();
        this.budgetView = new BudgetView();
        this.timeBudgetView = new TimeBudgetView();
        this.configurationView = new ConfigurationView();
        this.notificationView = new NotificationView();
        // this.budgetView.model.getBudgets();
        this.timeBudgetView.model.getTimeBudgets();
        this.footer = new FooterView();
        this.router = new AppRouter({
            defaultView: 'AWSView'
        });


        this.bindings();
        this.render();
        this.setListeners();

        $('.content-view').append(this.footer.el);
        $('.content-view').append(this.latestTime.el);
        //Resize the content view
        window_size = $(window).height();
        // console.log(window_size);
        var length_calc = (window_size - 50);
        var length = length_calc + 'px';
        this.$('.content-view').css({
            'height': length
        });


        $(window).resize(function() {
            //resize just happened, pixels changed
            window_size = $(window).height();
            // console.log(window_size);
            var length_calc = (window_size - 50);
            var length = length_calc + 'px';
            this.$('.content-view').css({
                'height': length
            });


        });


// var docHeight = $(".content-view").height();
// var footerHeight = $('.FooterView').height();
// console.log(docHeight);
// console.log(footerHeight);
// var footerTop = $('.FooterView').position().top + footerHeight;

 // if (footerTop < docHeight) {
 //    $('.FooterView').css('margin-top', 10+ (docHeight - footerTop) + 'px');
 //   }
        // var footerResize = function() {
        //     $('.FooterView').css('position', $(".content-view").height() + $(".FooterView").innerHeight() > $(window).height() ? "inherit" : "fixed");
        // };
        // $(window).resize(footerResize).ready(footerResize);
        // console.log(footerResize());
    },

    setListeners: function() {
        // url changes drive location within the app
        var self = this;
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

    bindings: function() {
        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        this.$el.on("click", '.menu', function(e) {
            if (this.navView.model.isOpen == true) {
                this.navView.model.isOpen = false;
            } else {
                this.navView.model.isOpen = true;
                window_size = $(window).height();
                // console.log(window_size);
                var length_calc = (window_size);
                var length = length_calc + 'px';
                this.$('.NavView').css({
                    'height': length
                });
            }
        }.bind(this));

        this.$el.on("mouseenter", '.menu', function(e) {
            this.navView.model.isOpen = true;
            window_size = $(window).height();
            var length_calc = (window_size);
            var length = length_calc + 'px';
            this.$('.NavView').css({
                'height': length
            });
        }.bind(this));

        this.$el.on("mouseenter", '.NavView', function(e) {
            this.navView.model.isOpen = true;
        }.bind(this));

        this.$el.on("mouseleave", '.NavView', function(e) {
            this.navView.model.isOpen = false;
        }.bind(this));

        this.$el.on("mouseleave", '.menu', function(e) {
            this.navView.model.isOpen = false;
        }.bind(this));

        this.$el.on("click", '.setting', function(e) {}.bind(this));

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

        this.$el.on("click", '.notify', function(e) {
            // console.log('notification clicked')
            if (this.notificationView.model.isOpen == false) {
                this.notificationView.model.isOpen = true;
                // this.$( ".mdl-badge" ).removeAttr( "data-badge");
            } else {
                this.notificationView.model.isOpen = false;
            }
        }.bind(this));

        this.notificationView.model.change('dataReady', function(model, val) {
            if (this.notificationView.model.getSeenNumber() == 0) {
                this.$(".mdl-badge").removeAttr("data-badge");
            } else {
                this.$(".mdl-badge").attr("data-badge", this.notificationView.model.getSeenNumber());
            }
        }.bind(this));

    },

    render: function() {
        this.$el.html(Handlebars.templates.AppView({
            time: this.time

        }));
        this.$el.append(this.header.el);
        this.$el.append(this.navView.el);
        this.$el.append(this.configurationView.el);
        // this.$el.append(this.footer.el);
        this.$el.append(this.budgetView.el);
        this.$el.append(this.timeBudgetView.el);
        this.$el.append(this.notificationView.el);

        // this.$el.append(this.meterActivity.el);       
        // this.$el.append(this.latestTime.el);
        // this.$('.content-view').append(this.footer.el);
        this.setView(this.router.get('view'));
    },

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