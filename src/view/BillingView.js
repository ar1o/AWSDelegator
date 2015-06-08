var BillingView = Backbone.View.extend({

    className: 'BillingView',

    initialize: function(options) {
        console.log("HELLO THIS IS BILLINGVIEW")
        if (!this.model) {
            this.model = new BillingsModel();
        }
        this.bindings();
        // this.render();

    },

    //Check for when the data is read and renders the page
    bindings: function() {
        console.log("THIS IS INSTANTIATED");
        this.model.change('dataReady', function(model, val) {
            console.log("THE DATA IS READY TO BE RENDERED");
                this.render();

            $(function() {
                // call the tablesorter plugin 
                $.tablesorter.defaults.sortList = [
                    [4, 0]
                ];
                $.tablesorter.defaults.widgets = ['zebra'];
                $("#BillingTable").tablesorter({

                    // header layout template; {icon} needed for some themes
                    headerTemplate: '{content}{icon}',
                    // initialize zebra striping and column styling of the table
                });

            });
        }.bind(this));

    },

    render: function() {
        var html = Handlebars.templates.BillingView({
            billing: totalCostInstancesCollection.toJSON()
        });
        this.$el.html(html);
    }


}); 
