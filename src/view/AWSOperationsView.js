var AWSOperationsView = Backbone.View.extend({
    className: 'AWSOperationsView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new OperationsModel();
        }
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var dataOperations = [];
            for (var i = 0; i < operationsCollection.length; i++) {
                dataOperations.push([operationsCollection.at(i).get('operation'), operationsCollection.at(i).get('percentage')]);
            }
            $(function() {
            $('#awsoperationscontainer').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Operations'
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
                        name: 'Operations',
                        data: dataOperations
                    }]
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.AWSOperationsView;
        this.$el.html(html);
    }
});