var AppView = Backbone.View.extend({

    initialize: function(options) {
        AppView.sharedInstance = this;

        this.header = new HeaderView();
        this.footer = new FooterView();
        this.navView = new NavView();
        // this.configurationView = new ConfigurationView()

        this.router = new AppRouter({
            defaultView: 'AWSView'
        });

        this.bindings();
        this.render();
        this.setListeners();

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

        this.$el.on("mouseenter", '.menu', function(e) {
            this.navView.model.isOpen = true;
            var length_calc = (this.$el.height() - 20);
            var length = length_calc + 'px';
            self.$('.NavView').css({
                'height': length
            });
        }.bind(this));

        // this.$el.on("mouseleave", '.menu', function(e) {
        //     this.navView.model.isOpen = false;
        // }.bind(this));
    
        

        this.$el.on("mouseenter", '.NavView', function(e) {
            this.navView.model.isOpen = true;
        }.bind(this));

        this.$el.on("mouseleave", '.NavView', function(e) {
            this.navView.model.isOpen = false;
        }.bind(this));

        this.$el.on("mouseenter", '.setting', function(e) {
            this.configurationView.model.openConfig = true;
            var length_calc = (this.$el.height() - 60);
            var length = length_calc + 'px';
            self.$('.ConfigurationView').css({
                //altered this to fix runaway height issue
                'height': length
            });
        }.bind(this));
        // workaround. not sure how I broke this
        // this.$el.on("mouseleave", '.setting', function(e) {
        //     this.configurationView.model.openConfig = false;
        // }.bind(this));

        this.$el.on("mouseenter", '.ConfigurationView', function(e) {
            this.configurationView.model.openConfig = true;
        }.bind(this));

        this.$el.on("mouseleave", '.ConfigurationView', function(e) {
            this.configurationView.model.openConfig = false;
        }.bind(this));

//Need to alter these as to prevent configuration from linking to menu pages
        this.$el.on('click', '[page-id="0"]', function(e) {
            this.navView.model.isOpen = false;
            window.location.hash = '#/AWS';
        }.bind(this));

        this.$el.on('click', '[page-id="1"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/EC2';
        }.bind(this));

        this.$el.on('click', '[subpage-id="0"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/EC2Instances';
        }.bind(this));

        this.$el.on('click', '[page-id="2"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/RDS';
        }.bind(this));

        this.$el.on('click', '[subpage-id="1"]', function(e) {
            this.navView.model.isOpen = false
            window.location.hash = '#/RDSInstances';
        }.bind(this));

    },

    render: function() {
        this.$el.html(Handlebars.templates.AppView());
        this.$el.append(this.header.el);
        this.$el.append(this.navView.el);
        // this.$el.append(this.configurationView.el);
        this.$el.append(this.footer.el);

        this.setView(this.router.get('view'));
    },

    setView: function(view) {
        var args = this.router.get('args');
        args.parentView = this;
        var viewInstance = new view(args);
        // console.log(args);
        var oldView = this.model.get('currentView');
        if (oldView && oldView.destroy)
            oldView.destroy(viewInstance);
        this.model.set('currentView', viewInstance);
        this.$el.find('.content-view').html(viewInstance.el);
    }


});