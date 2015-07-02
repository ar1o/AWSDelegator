var UsageMonitorView = Backbone.View.extend({
    className: 'UsageMonitorView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        // this.bindings();
    },

    bindings: function() {
    },

    render: function() {
        // var html = Handlebars.templates.EC2InstancesView;
        // this.$el.html(html);
    }
});