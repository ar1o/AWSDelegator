var BillingView = Backbone.View.extend({
    className: 'BillingView',

    initialize: function(options) {
        
        if (!this.model) {
            this.model = new BillingsModel();
        }

        this.render();
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var date = new Date(totalCostInstancesCollection.at(0).get('date'));            
            $(function () {
                $('#billingcontainer').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: totalCostInstancesCollection.at(0).get('resourceId')+' Cost'
                    },
                    xAxis: {
                        title : {text : "Time"},
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Price (USD)'
                        },
                        min: 0,
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
                        alternateGridColor: null,                        
                    },
                    tooltip: {
                        valueSuffix: '$/Hour'
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Cost',
                        pointInterval: 3600 * 1000,
                        pointStart: Date.UTC(date.getYear(), date.getMonth(), date.getDate()),
                        data: totalCostInstancesCollection.pluck('cost')

                    }],
                    navigation: {
                        menuItemStyle: {
                            fontType : 'Roboto',
                            fontSize: '10px'
                        }
                    }
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.BillingView({
            billing: totalCostInstancesCollection.toJSON(),
        });
        this.$el.html(html);
    }


});