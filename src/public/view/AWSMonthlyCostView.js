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
                month.push(this.model.getMonth(date.substring(5, 7)));
            }
            this.render();

            $(function() {
                $('#awsmonthlycostcontainer').highcharts({
                    chart: {
                        type: 'column',
                        backgroundColor: '#f7f7f7'
                    },
                    title: {
                        text: 'AWS Monthly Cost'
                    },
                    xAxis: {
                        categories: month,
                        crosshair: true
                    },
                    yAxis: {
                        // min: 0,
                        title: {
                            text: 'USD ($)'
                        }
                    },
                    tooltip: {
                        // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        // footerFormat: '</table>',
                        // shared: true,
                        // useHTML: true
                        pointFormat: '{series.name}: <b>USD{point.y:.4f}</b>'

                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Amazon Web Service with Free-tier',
                        data: AWSMonthlyCost.pluck('cost')
                    }, {
                        name: 'Amazon Web Service without Free-tier',
                        data: AWSMonthlyCostNF.pluck('cost')
                    }]
                });
            });

        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.AWSMonthlyCostView;
        this.$el.html(html);
    }
});