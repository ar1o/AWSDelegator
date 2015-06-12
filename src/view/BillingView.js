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
            var date;
            try{
                date = new Date(totalCostInstancesCollection.at(0).get('date'));
            } catch(e) {
                date = new Date();
                console.log("NO DATA FOUND");
            }

            $(function() {
                $('#container').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: 'EC2 Instance Cost'
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                    },
                    xAxis: {
                        type: 'datetime',
                        minRange: 14 * 24 * 3600000 // fourteen days
                    },
                    yAxis: {
                        title: {
                            text: 'Cost (USD)'
                        },
                        min: 0 // this sets minimum values of y to 0
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },
                    series: [{
                        type: 'area',
                        name: 'Cost',
                        pointInterval: 3600 * 1000,
                        pointStart: Date.UTC(date.getYear(), date.getMonth(), date.getDate()),
                        data: totalCostInstancesCollection.pluck('cost')

                    }]
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