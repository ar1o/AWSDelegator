var AppView = Backbone.View.extend({

	initialize: function(options) {

        AppView.sharedInstance = this;

        this.router = new AppRouter({ defaultView: 'InstancesView' });
        
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
            if(currentView.updateArguments) {
                var changeView = currentView.updateArguments(args, prevArgs);
                prevArgs = args;
                if(!changeView) {
                    setTimeout(function() {
                        var view = self.router.get('view');
                        self.setView(view);
                    }, 100);
                }
            }
        });


	},

	render: function() {		

		this.$el.html(Handlebars.templates.AppView());

		this.setView(this.router.get('view'));

	},

	setView: function(view) {
        var args = this.router.get('args');
        args.parentView = this;
        var viewInstance = new view(args);
		var oldView = this.model.get('currentView');
        if(oldView && oldView.destroy)
            oldView.destroy(viewInstance);
		this.model.set('currentView', viewInstance);
		this.$el.find('.content-view').html(viewInstance.el);
	}
    

});