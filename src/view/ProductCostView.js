var ProductCostView = Backbone.View.extend({
    className: 'ProductCostView',

    initialize: function(options) {
        
        if (!this.model) {
            this.model = new ProductCostModel();
        }

        this.EC2Instances = new InstancesView();
        this.EC2Cost = new EC2CostView();
        this.render();
        this.bindings();
    },

    bindings: function() {
            var self = this;

        this.model.change('dataReady', function(model, val) {
            this.render();

            var month = this.model.getMonth(productCostCollection.at(0).get('month'));
            var year = productCostCollection.at(0).get('year')
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
                        plotShadow: false,
                    },
                    title: {
                        text: 'Amazon Web Service Cost Breakdown - Month: ' + month + ' ' + year
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
                                        self.EC2Instances.model.getEC2Instances();
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

        this.$el.on("change", '.instanceDropDown', function(e) {
            var selected = $('.instanceDropDown').val();
            console.log(selected);
            this.EC2Instances.updateViews(selected);
        }.bind(this));


        this.$el.on("click", '#InstanceTable tr', function(e) {
            var href = $('td', this).eq(0).text();
            console.log("test", href);
        });


        this.$el.on('click', '#InstanceTable tr', function() {
            var name = $('td', this).eq(0).text();
            console.log('You clicked on ' + name + '\'s row');
            if(name != "") {
            totalCostInstancesCollection.reset();
            self.EC2Instances.updateViews(name);
        }

        });

    },

    render: function() {
        var html = Handlebars.templates.ProductCostView({
            product: productCostCollection.toJSON(),
        });
        this.$el.html(html);
        this.$el.append(this.EC2Cost.el);
        this.$el.append(this.EC2Instances.el);


    }


});