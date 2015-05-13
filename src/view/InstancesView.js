// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars


var InstancesView = Backbone.View.extend({

    className: 'InstancesView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new InstancesModel();
        }

        this.model.addEC2Instance();

        this.bindings();
        this.render();
    },
    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();

            $(function() {
                // call the tablesorter plugin
                $.tablesorter.defaults.widgets = ['zebra'];
                $("table").tablesorter({
                    theme: 'blue',
                    
                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });

            });
        }.bind(this));

    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON()

        });
        this.$el.html(html);
    }



});