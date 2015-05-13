// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars
var InstancesView = Backbone.View.extend({

    className: 'InstancesView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new InstancesModel();
        }

        var self = this;
        self.interval = setInterval(function() {
            self.model.addEC2Instance();
        }, 1000 * 60 * 60);
        // }, 5000);

        this.bindings();
        this.render();

    },

    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            // console.log(cpuMetricCollection.pluck('instance'));
        }.bind(this));


        this.model.change('cpuMetrics', function(model, val) {
            this.render();
        }.bind(this));

        this.model.change('networkInMetrics', function(model, val) {
            this.render();
        }.bind(this));

        this.model.change('networkOutMetrics', function(model, val) {
            this.render();
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON(),
            cpuMetrics: cpuMetricCollection.toJSON(),
            networkIn: networkInMetricCollection.toJSON(),
            networkOut: networkOutMetricCollection.toJSON()
        });
        this.$el.html(html);
    }


});