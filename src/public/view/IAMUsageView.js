var IAMUsageView = Backbone.View.extend({
    className: 'IAMUsageView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        var self = this;
        costView = new IAMCostView();
        this.budgetIndex = -1;
        this.bindings();
        this.render();
    },

    updateViews: function(budgetIndex){
        self.budgetIndex = budgetIndex;
        this.model.getBudgetUsageChart(budgetIndex);
    },

    bindings: function() {
        this.model.change('budgetUsageDataReady', function(model, val) {
            this.render();
            var highchart = $(function() {
                var _title = 'Budget Usage Chart - '+budgetCollection.at(self.budgetIndex).get('budgetName');
                var highcharts_options = {
                    chart: {
                        type: 'bar'
                    },
                    colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', 
                             '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                    title: {
                        text: _title
                    },
                    xAxis: {
                        lineColor: 'transparent',
                        categories: ['Budget Usage']
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        gridLineColor: 'transparent',
                        title: {
                            text: 'Budget usage %'
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                'Total Cost: '+ budgetUsageCollection.at(0).get('total').toFixed(2) + ' USD , '+
                                'Usage Percentage: ' + this.y.toFixed(2) + '%';
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        }
                    }
                };
                var dataUsage = [];
                for (var i = 0; i < operationsCollection.length; i++) {
                    dataOperations.push({name: budgetUsageCollection.at(i).get('batchName'), y:[budgetUsageCollection.at(i).get('usage')], id: i});
                }
                var _series = [];
                for(var i=0;i<budgetUsageCollection.length;++i){
                    _series.push({
                        name: budgetUsageCollection.at(i).get('batchName'),
                        data: [budgetUsageCollection.at(i).get('usage')],
                        point: {
                            events: {
                                click: function(event) {
                                    self.costView.updateUserAttributes(this.series.name,this.color)
                                }
                            }
                        }
                    });
                }
                highcharts_options['series']=_series;
                $('#budgetUsageContainer').highcharts(highcharts_options);
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.IAMUsageView;
        this.$el.html(html);
    }
});