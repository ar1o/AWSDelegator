var ProductCostView = Backbone.View.extend({
    className: 'ProductCostView',

    initialize: function(options) {
        
        if (!this.model) {
            this.model = new ProductCostModel();
        }

        this.render();
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var total = this.model.calcTotal();
            var fdata = [];
            for (var i = 0; i < productCostCollection.length; i++) {
                fdata.push([productCostCollection.at(i).get('productName'), productCostCollection.at(i).get('cost')]);
            }
            $(function() {
                $('#productcostcontainer').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: 'Product Cost'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>USD{point.y:.1f}</b>'
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
        var html = Handlebars.templates.ProductCostView({
            product: productCostCollection.toJSON(),
        });
        this.$el.html(html);
    }


});