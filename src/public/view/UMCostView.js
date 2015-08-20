//For tables displayed in the Cost View
var UMCostView = Backbone.View.extend({
    className: 'UMCostView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.userColor = '';
        this.userName = '';
        this.bindings();
        this.render();
    },

    updateViews: function(budgetIndex){
        this.model.getBudgetCostChart(budgetIndex);
    },

    updateUserAttributes: function(_name, _color){
        this.userName = _name;
        this.userColor = _color;
    },

    bindings: function() {
        var self = this;
        this.model.change('budgetCostDataReady', function(model, val) {
            this.render();
            var date = budgetCostCollection.at(budgetCostCollection.length-1).get('date').split(' ');
            //date1=[year,month,date]
            var date1 = date[0].split(/-/);
            //date2=[hour,minute,second]                
            // var date2 = date[1].split(':');
            //correction for JS viewing JAN as '00'
            var month = parseInt(date1[1]);
            date1[1] = month - 1;
            var endDate = Date.UTC(date1[0], date1[1], date1[2]);
            
            var date = budgetCostCollection.at(0).get('date').split(' ');
            //date1=[year,month,date]
            var date1 = date[0].split(/-/);
            //date2=[hour,minute,second]                
            // var date2 = date[1].split(':');
            //correction for JS viewing JAN as '00'
            var month = parseInt(date1[1]);
            date1[1] = month - 1;
            var startDate = Date.UTC(date1[0], date1[1], date1[2]);
            var budgetIndex = budgetIndexCollection.at(0).get('index');
            $(function() {
                $('#budgetCostContainer').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Group Cost Chart - '+budgetCollection.at(budgetIndex).get('budgetName')
                    },
                    xAxis: {
                        max: endDate,
                        min: startDate,
                        title: {
                            text: "Time"
                        },
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Price (USD)'
                        },
                        min: 0,
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
                        alternateGridColor: null,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null,         
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                new Date(this.x) + ', ' + this.y+' USD';
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Cost',
                        pointInterval: 3600 * 1000,
                        pointStart: startDate,
                        data: budgetCostCollection.pluck('cost')
                    }],
                    navigation: {
                        menuItemStyle: {
                            fontType: 'Roboto',
                            fontSize: '10px'
                        }
                    }
                });
            });

        }.bind(this));

        this.model.change('userBudgetCostDataReady', function(model, val) {
            this.render();
            var date = userBudgetCostCollection.at(userBudgetCostCollection.length-1).get('date').split(' ');
            //date1=[year,month,date]
            var date1 = date[0].split(/-/);
            //date2=[hour,minute,second]                
            var date2 = date[1].split(':');
            //correction for JS viewing JAN as '00'
            var month = parseInt(date1[1]);
            date1[1] = month - 1;
            var endDate = Date.UTC(date1[0], date1[1], date1[2], date2[0], date2[1], date2[2]);
            
            var date = userBudgetCostCollection.at(0).get('date').split(' ');
            //date1=[year,month,date]
            var date1 = date[0].split(/-/);
            //date2=[hour,minute,second]                
            var date2 = date[1].split(':');
            //correction for JS viewing JAN as '00'
            var month = parseInt(date1[1]);
            date1[1] = month - 1;
            var startDate = Date.UTC(date1[0], date1[1], date1[2], date2[0], date2[1], date2[2]);

            var costData = [];
            for (var i = 0; i < budgetCostCollection.length - 1; ++i) {
                var date = budgetCostCollection.at(i).get('date').split(' ');
                //date1=[year,month,date]
                var date1 = date[0].split(/-/);
                //date2=[hour,minute,second]                
                var date2 = date[1].split(':');
                //correction for JS viewing JAN as '00'
                var month = parseInt(date1[1]);
                date1[1] = month - 1;
                var utcDate = Date.UTC(date1[0], date1[1], date1[2], date2[0], date2[1], date2[2]);
                costData.push([utcDate,budgetCostCollection.at(i).get('cost')]);
            }

            var userCostData = [];
            for (var i = 0; i < userBudgetCostCollection.length - 1; ++i) {
                var date = userBudgetCostCollection.at(i).get('date').split(' ');
                //date1=[year,month,date]
                var date1 = date[0].split(/-/);
                //date2=[hour,minute,second]                
                var date2 = date[1].split(':');
                //correction for JS viewing JAN as '00'
                var month = parseInt(date1[1]);
                date1[1] = month - 1;
                var utcDate = Date.UTC(date1[0], date1[1], date1[2], date2[0], date2[1], date2[2]);
                userCostData.push([utcDate,userBudgetCostCollection.at(i).get('cost')]);
            }
            var budgetIndex = budgetIndexCollection.at(0).get('index');
            $(function() {
                $('#budgetCostContainer').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Group Cost Chart - '+budgetCollection.at(budgetIndex).get('budgetName')
                    },
                    xAxis: {
                        max: endDate,
                        min: startDate,
                        title: {
                            text: "Time"
                        },
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Price (USD)'
                        },
                        min: 0,
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
                        alternateGridColor: null,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null,         
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                new Date(this.x) + ', ' + this.y+' USD';
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    series: [{
                        name: budgetCollection.at(budgetIndex).get('batchName'),
                        pointInterval: 3600 * 1000,
                        pointStart: startDate,
                        data: costData
                    },{
                        name: self.userName,
                        pointInterval: 3600 * 1000,
                        pointStart: startDate,
                        color: self.userColor,
                        data: userCostData
                    }],
                    navigation: {
                        menuItemStyle: {
                            fontType: 'Roboto',
                            fontSize: '10px'
                        }
                    }
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.UMCostView;
        this.$el.html(html);
    }
});