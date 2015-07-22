var IAMGroupsView = Backbone.View.extend({
    className: 'IAMGroupsView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.model.getGroups();
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
    },

    render: function() {
        var html = Handlebars.templates.IAMGroupsView({
            instances: GroupCollection.toJSON()
        });
        this.$el.html(html); 
    }
});