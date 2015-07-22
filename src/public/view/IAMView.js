var IAMView = Backbone.View.extend({
    className: 'IAMView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getGroups();
        this.model.getUsers();
        this.bindings();
    },

    bindings: function() {
        var self = this;
        this.model.change('groupDataReady', function(model, val) {
            this.render();
            $('#GroupsTable').DataTable({
                "iDisplayLength": 15
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));

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
        var html = Handlebars.templates.IAMView({
            groupInstances: GroupCollection.toJSON(),
            userInstances: UserCollection.toJSON()
        });
        this.$el.html(html);
    }
});