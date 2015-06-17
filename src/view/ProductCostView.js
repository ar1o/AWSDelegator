var ProductCostView = Backbone.View.extend({
    className: 'ProductCostView',

    initialize: function(options) {
        
        if (!this.model) {
            this.model = new ProductCostModel();
        }

        
        this.EC2Cost = new EC2CostView();
        this.render();
        this.bindings();
    },

    bindings: function() {

        this.model.change('dataReady', function(model, val) {
            this.render();

            var month = this.model.getMonth(productCostCollection.at(0).get('month'));
            var year = productCostCollection.at(0).get('year')
            var total = this.model.calcTotal();
            var fdata = [];
            for (var i = 0; i < productCostCollection.length; i++) {
                fdata.push([productCostCollection.at(i).get('productName'), productCostCollection.at(i).get('cost')]);
            }
            var self = this;
            $(function() {
                $('#productcostcontainer').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                    },
                    title: {
                        text: 'Product Cost - Month: ' + month + '\\' + year
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
                        data: fdata,
                        point: {
                            events: {
                                click: function(event) {
                                    if (this.name == "Amazon Elastic Compute Cloud") {
                                        self.EC2Cost.model.getCost();
                                    } else if (this.name == "Amazon RDS Service") {
                                        console.log(this.name);
                                    }
                                }
                            }
                        }
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
        this.$el.append(this.EC2Cost.el);

    }


});