
var AWSMonthlyCostView = Backbone.View.extend({
    className: 'AWSMonthlyCostView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new CostModel();
        }
        this.model.getAWSMonthlyCost();
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            //Find out the month
            var month = [];
            for (var i = 0; i < AWSMonthlyCost.length; i++) {
                var date = AWSMonthlyCost.at(i).get('date');
                fdate = this.model.getMonth(date.substring(5, 7));
                if (fdate == month[month.length - 1]) {
                } else {
                    month.push(this.model.getMonth(date.substring(5, 7)));
                }

            }
            //Organize the free-tier and non-free-tier data for display in stacked bar chart
            var nfdata = this.model.OrganizeData(AWSMonthlyCostNF, 'non-free-tier');
            var fdata = this.model.OrganizeData(AWSMonthlyCost, 'free-tier');

            this.render();
            $(function() {
                $('#awsmonthlycostcontainer').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'AWS Monthly Breakdown'
                    },
                    xAxis: {
                        categories: month
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: true
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
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.AWSMonthlyCostView;
        this.$el.html(html);
    }
});