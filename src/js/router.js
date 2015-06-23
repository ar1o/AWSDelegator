var AppRouter = Backbone.Model.extend({

    defaults: {
        view: undefined,
        args: {},
        defaultView: 'AWSView'
    },
    
    initialize: function(options) {
        var self = this;
        this.calcHashChange();
        $(window).on('hashchange', function() { 
            self.calcHashChange();
        });
        this.layout = options.layout;
    },

    switchToView: function(view, args) {
        console.log("args",args);
        args = args || {};
        this.set('args', args);
        this.set('view', window[view]);
      },

    calcHashChange: function() {
        var parts = window.location.hash.split('/');
        if(parts.length <= 1)
            return this.set('view', window[this.get('defaultView')]);
        var view = parts[1];
        view = view[0].toUpperCase() + view.substr(1) + 'View';
        var map = {};
        for(var i = 3; i < parts.length; i+=2) {
            map[ parts[i-1] ] = parts[i];
        }
        var silent = window[view] === this.get('view') ? false : true;
        this.set('args', map, { silent: silent });
        this.set('view', window[view]);
    }
    
});


