// Here is where the EC2 Instances are renders the instanceCollection JSON object
// by the handlebars template called InstancesView.handlebars


var InstancesView = Backbone.View.extend({

    className: 'InstancesView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.model.addEC2Instance();

        this.billingActivity = new BillingView();
        this.metricsActivity = new MetricsView();
        this.productCost = new ProductCostView();
        this.bindings();
        this.render();

    },

    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();

            $(function() {
                // call the tablesorter plugin 
                $.tablesorter.defaults.sortList = [[0,0]];
                $.tablesorter.defaults.widgets = ['zebra'];
                $("#InstanceTable").tablesorter({

                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });
            });
            this.metricsActivity.model.getMetrics(instanceCollection.at(0).get('instance'));
            this.billingActivity.model.getBilling(instanceCollection.at(0).get('instance'));
        }.bind(this));

        this.$el.on("change", '.instanceDropDown', function(e) {
            console.log( $('.instanceDropDown').val()); 
            var selected = $('.instanceDropDown').val();
            totalCostInstancesCollection.reset();
            this.billingActivity.model.getBilling(selected); 
            this.metricsActivity.model.getMetrics(selected);

        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON()
        });
        this.$el.html(html);
         this.$el.append(this.productCost.el);
        this.$el.append(this.billingActivity.el);
        this.$el.append(this.metricsActivity.el);
       
    }
});