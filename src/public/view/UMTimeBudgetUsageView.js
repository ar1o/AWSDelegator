var UMTimeBudgetUsageView = Backbone.View.extend({
    className: 'UMTimeBudgetUsageView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.costView = new UMTimeBudgetCostView();
        this.groupUserServiceView = new UMTimeGroupUserServiceView();
        this.bindings();
    },

    bindings: function() {
        var self = this;
        this.model.change('budgetUsageDataReady', function(model, val) {
            this.render();
            var budgetIndex = budgetIndexCollection.at(0).get('index');
            var highchart = $(function() {
                var _title = 'Time Budget Usage Chart - '+timeBudgetCollection.at(budgetIndex).get('timeBudgetName');
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
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                'Total hours: '+ budgetUsageCollection.at(0).get('total').toFixed(2) + ' hrs , '+
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
                if(totalBudgetCollection.at(0).get('usage')<=1){
                    highcharts_options['yAxis'] = {
                        min: 0,
                        max: 100,
                        gridLineColor: 'transparent',
                        title: {
                            text: 'Budget usage %'
                        }
                    };
                }else{
                    highcharts_options['yAxis'] = {
                        min: 0,
                        gridLineColor: 'transparent',
                        title: {
                            text: 'Budget usage %'
                        }
                    };
                }
                var dataOperations = [];
                for (var i = 0; i < budgetUsageCollection.length; i++) {
                    dataOperations.push({name: budgetUsageCollection.at(i).get('batchName'), y:[budgetUsageCollection.at(i).get('usage')], id: i});
                }
                var _series = [];
                for(var i=0;i<budgetUsageCollection.length;++i){
                    _series.push({
                        pointWidth: 60,
                        name: budgetUsageCollection.at(i).get('batchName'),
                        data: [budgetUsageCollection.at(i).get('usage')],
                        point: {
                            events: {
                                click: function(event) {
                                    if(timeBudgetCollection.at(budgetIndexCollection.at(0).get('index')).get('batchType')=='group'){
                                        self.costView.updateUserAttributes(this.series.name,this.color);
                                        self.costView.model.getUserTimeCostBudget(budgetIndex,this.series.name);
                                        self.groupUserServiceView.setUser(this.series.name);
                                        self.groupUserServiceView.model.getTimeGroupUserServiceUsageChart(this.series.name,budgetIndex);  
                                    }                                                                    
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
        var html = Handlebars.templates.UMUsageView;
        this.$el.html(html);
        this.$el.append(this.groupUserServiceView.el);
    }
});