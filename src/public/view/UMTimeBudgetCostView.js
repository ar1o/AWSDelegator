//For graphs displayed in Time Budget View
var UMTimeBudgetCostView = Backbone.View.extend({
    className: 'UMTimeBudgetCostView',

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
            var rawDate = budgetCostCollection.at(budgetCostCollection.length-1).get('date').split(' ');
            //date=[year,month,date]
            var date = rawDate[0].split(/-/);
            //time=[hour,minute,second]                
            var time = rawDate[1].split(':');
            //correction for JS viewing JAN as '00'
            var month = parseInt(date[1]);
            date[1] = month - 1;
            var endDate = Date.UTC(date[0], date[1], date[2], time[0], time[1], time[2]);
            
            //date format- ISOString i.e., '2015-07-22T17:26:16.799Z' 
            var date = budgetCostCollection.at(0).get('date').split('T');
            //date=[year,month,date]
            var date = rawDate[0].split(/-/);
            //time=[hour,minute,second]                
            var time = rawDate[1].split(':');
            time[2] = time[2].substring(0,time[2].indexOf('.'));
            //correction for JS viewing JAN as '00'
            var month = parseInt(date[1]);
            date[1] = month - 1;
            var startDate = Date.UTC(date[0], date[1], date[2], time[0], time[1], time[2]);
            var budgetIndex = budgetIndexCollection.at(0).get('index');
            
            var costData = [];
            for (var i = 0; i < budgetCostCollection.length - 1; ++i) {
                var date = budgetCostCollection.at(i).get('date').split('T');
                //date=[year,month,date]
                var date = rawDate[0].split(/-/);
                //time=[hour,minute,second]                
                var time = rawDate[1].split(':');
                time[2] = time[2].substring(0,time[2].indexOf('.'));
                //correction for JS viewing JAN as '00'
                var month = parseInt(date[1]);
                date[1] = month - 1;
                var utcDate = Date.UTC(date[0], date[1], date[2], time[0], time[1], time[2]);
                costData.push([utcDate,-1*budgetCostCollection.at(i).get('cost')]);
            }

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
                        text: 'Group Time Decay Chart - '+timeBudgetCollection.at(budgetIndex).get('timeBudgetName')
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
                            text: 'decayRate (hrs)'
                        },
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
                                new Date(this.x) + ', ' + this.y+' hrs';
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'DecayRate',
                        pointInterval: 3600 * 1000,
                        pointStart: startDate,
                        data: costData
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
            var rawDate = userBudgetCostCollection.at(userBudgetCostCollection.length-1).get('date').split(' ');
            //date=[year,month,date]
            var date = rawDate[0].split(/-/);
            //time=[hour,minute,second]                
            var time = rawDate[1].split(':');
            //correction for JS viewing JAN as '00'
            var month = parseInt(date[1]);
            date[1] = month - 1;
            var endDate = Date.UTC(date[0], date[1], date[2], time[0], time[1], time[2]);
            
            var date = userBudgetCostCollection.at(0).get('date').split('T');
            //date=[year,month,date]
            var date = rawDate[0].split(/-/);
            //time=[hour,minute,second]                
            var time = rawDate[1].split(':');
            time[2] = time[2].substring(0,time[2].indexOf('.'));
            //correction for JS viewing JAN as '00'
            var month = parseInt(date[1]);
            date[1] = month - 1;
            var startDate = Date.UTC(date[0], date[1], date[2], time[0], time[1], time[2]);

            var costData = [];
            for (var i = 0; i < budgetCostCollection.length - 1; ++i) {
                var date = budgetCostCollection.at(i).get('date').split('T');
                //date=[year,month,date]
                var date = rawDate[0].split(/-/);
                //time=[hour,minute,second]                
                var time = rawDate[1].split(':');
                time[2] = time[2].substring(0,time[2].indexOf('.'));
                //correction for JS viewing JAN as '00'
                var month = parseInt(date[1]);
                date[1] = month - 1;
                var utcDate = Date.UTC(date[0], date[1], date[2], time[0], time[1], time[2]);
                costData.push([utcDate,-1*budgetCostCollection.at(i).get('cost')]);
            }

            var userCostData = [];
            for (var i = 0; i < userBudgetCostCollection.length - 1; ++i) {
                var date = userBudgetCostCollection.at(i).get('date').split('T');
                //date=[year,month,date]
                var date = rawDate[0].split(/-/);
                //time=[hour,minute,second]                
                var time = rawDate[1].split(':');
                time[2] = time[2].substring(0,time[2].indexOf('.'));
                //correction for JS viewing JAN as '00'
                var month = parseInt(date[1]);
                date[1] = month - 1;
                var utcDate = Date.UTC(date[0], date[1], date[2], time[0], time[1], time[2]);
                userCostData.push([utcDate,-1*userBudgetCostCollection.at(i).get('cost')]);
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
                        text: 'Group Time Decay Chart - '+timeBudgetCollection.at(budgetIndex).get('timeBudgetName')
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
                            text: 'decayRate (hrs)'
                        },
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
                                new Date(this.x) + ', ' + this.y+' hrs';
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    series: [{
                        name: timeBudgetCollection.at(budgetIndex).get('batchName'),
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