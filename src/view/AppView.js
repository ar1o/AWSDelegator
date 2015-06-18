var AppView = Backbone.View.extend({

	initialize: function(options) {

        this.router = new AppRouter({ defaultView: 'ProductCostView' });
		this.render();

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