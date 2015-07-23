var IAMView = Backbone.View.extend({
    className: 'IAMView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }

        this.users = new IAMUsersView();
        this.groups = new IAMGroupsView();

        this.render();
        this.bindings();
    },

    bindings: function() {
    },

    render: function() {
        var html = Handlebars.templates.IAMView({
        });
        this.$el.html(html);
        this.$el.append(this.users.el);
        this.$el.append(this.groups.el);
    }
    
});