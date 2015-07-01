var NavView = Backbone.View.extend({

    className: 'NavView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new NavModel();
        }
        this.bindings();
        this.render();

    },

    bindings: function() {
        this.model.change('isOpen', function(model, val) {
            var toggle = val ? 'addClass' : 'removeClass';
            this.$el[toggle]('visible');
        }.bind(this));



    },

    render: function() {
        var html = Handlebars.templates.NavView({
            pages: NavViewCollection.toJSON()
        });
        this.$el.html(html);


    }
});

//Handlebars helper method for logic cases
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});