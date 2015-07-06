var AWSMonthlyCostView = Backbone.View.extend({
    className: 'AWSMonthlyCostView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new CostModel();
        }
        this.model.getAWSMonthlyCost();
        this.model.getAWSMonthlyCostNonFree();
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            var month = [];
            for (var i = 0; i < AWSMonthlyCost.length; i++) {
                var date = AWSMonthlyCost.at(i).get('date');
                if(this.model.getMonth(date.substring(5,7)) in month) {
                    console.log('skipping');
                } else {
                    month.push(this.model.getMonth(date.substring(5, 7)));
                }
                // console.log(month);

                for (var i = 0; i < AWSMonthlyCost.length; i++) {
                    var date = AWSMonthlyCost.at(i).get('date');
                    var product = AWSMonthlyCost.at(i).get('product');
                    var cost = AWSMonthlyCost.at(i).get('cost');
                    console.log(date +" "+ product +" "+ cost);
                }
            }
            this.render();
            $(function() {
                $('#awsmonthlycostcontainer').highcharts({

                    chart: {
                        type: 'column'
                    },

                    title: {
                        text: 'Total fruit consumtion, grouped by gender'
                    },

                    xAxis: {
                        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                    },

                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: 'Number of fruits'
                        }
                    },

                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>' +
                                'Total: ' + this.point.stackTotal;
                        }
                    },

                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },

                    series: [{
                        name: 'John',
                        data: [5, 3, 4, 7, 2],
                        stack: 'male'
                    }, {
                        name: 'Joe',
                        data: [3, 4, 4, 2, 5],
                        stack: 'male'
                    }, {
                        name: 'Jane',
                        data: [2, 5, 6, 2, 1],
                        stack: 'female'
                    }, {
                        name: 'Janet',
                        data: [3, 0, 4, 4, 3],
                        stack: 'female'
                    }]
                });
            });
            // $(function() {
            //     $('#awsmonthlycostcontainer').highcharts({
            //         chart: {
            //             type: 'column',
            //             backgroundColor: '#f7f7f7'
            //         },
            //         title: {
            //             text: 'AWS Monthly Cost'
            //         },
            //         xAxis: {
            //             categories: month,
            //             crosshair: true
            //         },
            //         yAxis: {
            //             // min: 0,
            //             title: {
            //                 text: 'USD ($)'
            //             }
            //         },
            //         tooltip: {
            //             // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            //             // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            //             //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            //             // footerFormat: '</table>',
            //             // shared: true,
            //             // useHTML: true
            //             pointFormat: '{series.name}: <b>USD{point.y:.4f}</b>'

            //         },
            //         credits: {
            //             enabled: false
            //         },
            //         legend: {
            //             enabled: false
            //         },
            //         plotOptions: {
            //             column: {
            //                 pointPadding: 0.2,
            //                 borderWidth: 0
            //             }
            //         },
            //         series: [{
            //             name: 'Amazon Web Service with Free-tier',
            //             data: AWSMonthlyCost.pluck('cost')
            //         }, {
            //             name: 'Amazon Web Service without Free-tier',
            //             data: AWSMonthlyCostNF.pluck('cost')
            //         }]
            //     });
            // });

        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.AWSMonthlyCostView;
        this.$el.html(html);
    }
});