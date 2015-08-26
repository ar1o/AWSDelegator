var UsageMonitorView = Backbone.View.extend({
    className: 'UsageMonitorView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
    },

    render: function() {
        var html = Handlebars.templates.UsageMonitorView({});
    }
});