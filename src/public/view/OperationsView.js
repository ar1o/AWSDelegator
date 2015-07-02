var OperationsView = Backbone.View.extend({
    className: 'OperationsView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var dataOperations = [];
            for (var i = 0; i < operationsCollection.length; i++) {
                dataOperations.push({name: operationsCollection.at(i).get('operation'), y:operationsCollection.at(i).get('percentage'), id: i});
            }
            console.log(dataOperations);
            $(function() {
                $('#operationscontainer').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: '#f7f7f7'
                    },
                    // colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', 
                    //          '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                    title: {
                        text: 'Operations'
                    },
                    credits: {
                        enabled: false
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
                            },
                        }
                    },
                    series: [{
                        type: 'pie',
                        data: dataOperations,
                        point: {
                            events: {
                                click: function(event) {
                                    alert(this.name + " " + this.y+" "+this.color);
                                }
                            }
                        }
                    }]
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.OperationsView;
        this.$el.html(html);
    }
});