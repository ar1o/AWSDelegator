var RDSOperationsView = Backbone.View.extend({
    className: 'OperationsView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new InstancesModel();
        }
        this.rdsBillingActivity = new RDSBillingView();
        this.bindings();
        this.render();
    },

    bindings: function() {
        var self = this;
        this.model.change('operationsDataReady', function(model, val) {
            this.render();
            var dataOperations = [];
            for (var i = 0; i < operationsCollection.length; i++) {
                dataOperations.push({name: operationsCollection.at(i).get('operation'), y:operationsCollection.at(i).get('percentage'), id: i});
            }
            $(function() {
                $('#operationscontainer').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: '#f7f7f7'
                    },
                    colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', 
                             '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                    title: {
                        text: selectedInstanceCollection.at(0).get('instance')+' Operations'
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>USD {point.y:.4f}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: false,
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
                                    self.rdsBillingActivity.updateView(this.name,this.color);
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