var IAMUsersView = Backbone.View.extend({
    className: 'IAMUsersView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getUsers();
        this.bindings();
    },

    bindings: function() {
        var self = this;        
        this.model.change('userDataReady', function(model, val) {
            this.render();
            $('#UsersTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.IAMUsersView({
            instances: UserCollection.toJSON()
        });
        this.$el.html(html);
    }
});