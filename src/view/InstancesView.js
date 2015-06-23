var InstancesView = Backbone.View.extend({

    className: 'InstancesView',

    initialize: function(options) {

        if (!this.model) {
            this.model = new InstancesModel();
        }
        //render own view
        this.model.getEC2Instances();
        // child views
        this.billingActivity = new BillingView();
        this.metricsActivity = new MetricsView();

        this.bindings();

    },

    updateViews: function(selected) {
            this.billingActivity.model.getBilling(selected); 
            this.metricsActivity.model.getMetrics(selected);
    },

    bindings: function() {
        var self = this;
        this.render();
        this.model.change('dataReady', function(model, val) {
            console.log("Ec2Instances render");
            this.render();
            $('#InstanceTable').DataTable({
                "iDisplayLength": 25
                // "paging":   false,
                // "info":     false,
                // "bFilter": false
            });
        }.bind(this));


        this.$el.on("change", '.instanceDropDown', function(e) {
            var selected = $('.instanceDropDown').val();
            console.log(selected);
            totalCostInstancesCollection.reset();
            this.billingActivity.model.getBilling(selected); 
            this.metricsActivity.model.getMetrics(selected);
        }.bind(this));


        this.$el.on('click', '#InstanceTable tr', function() {
            var name = $('td', this).eq(0).text();
            console.log('You! clicked on ' + name + '\'s row');
            if (name != "") {
                totalCostInstancesCollection.reset();
                self.updateViews(name);
            }
        });
    },

    render: function() {
        var html = Handlebars.templates.InstancesView({
            instances: instanceCollection.toJSON()
        });
        this.$el.html(html);
        this.$el.append(this.billingActivity.el);
        this.$el.append(this.metricsActivity.el);

       
    }
});