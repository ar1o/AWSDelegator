var ProductCostView = Backbone.View.extend({
    className: 'ProductCostView',

    initialize: function(options) {
        
        if (!this.model) {
            this.model = new ProductCostModel();
        }

        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var month = this.model.getMonth(productCostCollection.at(0).get('month'));
            var year = productCostCollection.at(0).get('year')
            var fdata = [];

            for (var i = 0; i < productCostCollection.length; i++) {
                fdata.push([productCostCollection.at(i).get('productName'), productCostCollection.at(i).get('cost')]);
            }
            $(function() {
                $('#productcostcontainer').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: '#f7f7f7'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Amazon Web Service Cost Breakdown - '+year
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>USD{point.y:.4f}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Cost',
                        data: fdata
                    }]
                });
            });
        }.bind(this));

    },
    render: function() {
        var html = Handlebars.templates.ProductCostView;
        this.$el.html(html);

    }


});