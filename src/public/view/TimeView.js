var TimeView = Backbone.View.extend({
    className: 'TimeView',
    initialize: function(options) {
        if (!this.model) {
            this.model = new TimeModel();
        }
        var self = this;
        var time;
        this.model.getLatestTime(function(value){
            self.time = value;
            self.render();
        });
    },
    
    render: function() {
        var html = Handlebars.templates.TimeView({
            time: this.time
        });          
        this.$el.html(html);   
    }
});