var AWSMonthlyCostView = Backbone.View.extend({
    className: 'AWSMonthlyCostView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new CostModel();
        }
        this.model.getAWSMonthlyCost();
        // this.model.getAWSMonthlyCostNonFree();
        this.bindings();
    },

    org_data: function(collection, stax) {
        var hm = {};
        var fseries = [];
        var fdata = {};
        var fdate;
        console.log("stax", stax);
        var colors = ['#50B432', '#ED561B', '#DDDF00', '#24CBE5',
            '#64E572', '#FF9655', '#FFF263', '#6AF9C4'
        ];
        var productNames = {};
        for (var i = 0; i < collection.length; ++i) {
            var product = collection.at(i).get('product');
            if (!(product in productNames)) {
                productNames[collection.at(i).get('product')] = [{
                    name: collection.at(i).get('product'),
                    data: [],
                    stack: stax,
                    colors: colors[i]
                }];

                console.log("hello", productNames[collection.at(i).get('product')][0]);
            }
        }

        for (var i = 0; i < collection.length; i++) {

            var product = collection.at(i).get('product');
            var cost = collection.at(i).get('cost');

            productNames[collection.at(i).get('product')][0].data.push(cost)
            hm[product] = {
                name: product,
                data: productNames[collection.at(i).get('product')][0].data,
                stack: productNames[collection.at(i).get('product')][0].stack,
                colors: productNames[collection.at(i).get('product')][0].colors
            };
        }
        console.log(hm);

        for (var i in hm) {
            fdata = {
                name: hm[i].name, //productName (ie; EC2)
                data: hm[i].data, //the date per month
                stack: hm[i].stack, // Free-tier or non-free-tier
                color: hm[i].colors
            };
            fseries.push(fdata);
        }
        console.log("fseries", fseries);

        return fseries;
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            var month = [];
            for (var i = 0; i < AWSMonthlyCost.length; i++) {

                var date = AWSMonthlyCost.at(i).get('date');
                // console.log('month',month);
                fdate = this.model.getMonth(date.substring(5, 7));
                if (fdate == month[month.length - 1]) {
                    // console.log('skip');
                } else {
                    month.push(this.model.getMonth(date.substring(5, 7)));
                }

            }
            var nfdata = this.org_data(AWSMonthlyCostNF, 'non-free-tier');
            var fdata = this.org_data(AWSMonthlyCost, 'free-tier');
            // console.log("nfdata", nfdata);
            console.log("fdata", nfdata.concat(fdata));



            this.render();
            $(function() {
                $('#awsmonthlycostcontainer').highcharts({

                    chart: {
                        type: 'column'
                    },

                    title: {
                        text: 'Monthly Data'
                    },

                    xAxis: {
                        categories: month
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: 'USD ($)'
                        }
                    },

                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>' +
                                '<b>Total ('+this.series.options.stack+'):</b> ' + this.point.stackTotal;
                        }
                    },

                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },

                    series: nfdata.concat(fdata)
                        // [{
                        //     name: 'John', //productName (ie; EC2)
                        //     data: [5, 3, 4, 7, 2], //the date per month
                        //     stack: 'male' // Free-tier or non-free-tier
                        // }, {
                        //     name: 'Joe',
                        //     data: [3, 4, 4, 2, 5],
                        //     stack: 'male'
                        // }, {
                        //     name: 'Jane',
                        //     data: [2, 5, 6, 2, 1],
                        //     stack: 'female'
                        // }, {
                        //     name: 'Janet',
                        //     data: [3, 0, 4, 4, 3],
                        //     stack: 'female'
                        // }]
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.AWSMonthlyCostView;
        this.$el.html(html);
    }
});