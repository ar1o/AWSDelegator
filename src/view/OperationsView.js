var OperationsView = Backbone.View.extend({
    className: 'InstancesView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }

        this.bindings();
        this.render();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            console.log(operationsCollection);
            var dataOperations = [];
            for (var i = 0; i < operationsCollection.length; i++) {
                dataOperations.push([operationsCollection.at(i).get('operation'), operationsCollection.at(i).get('percentage')]);
            }
            this.render();
            $(function() {
                $('#operationscollection').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                    },
                    title: {
                        text: 'Operations of instance' + month + ' ' + year
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
        });
    },

    render: function() {
        var html = Handlebars.templates.OperationsView({
            metrics: metricsCollection.toJSON()
        });
        this.$el.html(html);
    }
});