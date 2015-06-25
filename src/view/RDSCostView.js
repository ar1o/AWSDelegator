var RDSCostView = Backbone.View.extend({
    className: 'RDSCostView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new CostModel();
        }
        this.model.getRDSCost();
        this.render();
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var date = new Date(hourlyCostCollection.at(0).get('date'));
            $(function() {
                $('#RDSCostContainer').highcharts('StockChart',{
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: 'Amazon RDS Cost Per Hour'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        title: {
                            text: "Time"
                        },
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
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null,
                    },
     
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Cost',
                        pointInterval: 3600 * 1000,
                        pointStart: Date.UTC(date.getYear(), date.getMonth(), date.getDate()),
                        data: hourlyCostCollection.pluck('cost')

                    }],
                    navigation: {
                        menuItemStyle: {
                            fontType: 'Roboto',
                            fontSize: '10px'
                        }
                    }
                });
            });

        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.RDSCostView({
            product: hourlyCostCollection.toJSON(),
        });
        this.$el.html(html);
    }
});