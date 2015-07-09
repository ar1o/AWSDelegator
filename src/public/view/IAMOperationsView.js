var IAMOperationsView = Backbone.View.extend({
    className: 'IAMOperationsView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.budgetIndex = -1;
        this.userColor = '';
        this.userName = '';
        this.bindings();
        this.render();
    },

    updateGroupView: function(budgetIndex){
        this.budgetIndex = budgetIndex;
        this.model.getGroupServiceUsageChart(budgetIndex);
    },

    updateUserView: function(budgetIndex){
        this.budgetIndex = budgetIndex;
        this.model.getUserServiceUsageChart(budgetIndex);
    },

    bindings: function() {
        this.model.change('serviceDataReady', function(model, val) {
            this.render();
            $(function() {
                var _data = [];
                var k=0;
                var data = [];
                var categories = [];
                var colors = Highcharts.getOptions().colors;
                for(var i in serviceCollection.at(0).get('services')){
                    categories.push(i);
                    _data = {};
                    _data['y']=Math.round((serviceCollection.at(0).get('services')[i].percentage) * 100) / 100;
                    _data['color']=colors[k];
                    var _drilldown = {
                        name: i+' operations'
                    }
                    var _categories = [], _data2 = [];
                    for(var j in serviceCollection.at(0).get('services')[i].operation){
                        _categories.push(j);
                        _data2.push(Math.round((serviceCollection.at(0).get('services')[i].operation[j].percentage) * 100) / 100);
                    }
                    _drilldown['categories'] = _categories;
                    _drilldown['data'] = _data2;
                    _drilldown['color'] = colors[k];
                    k+=1;
                    _data['drilldown']=_drilldown;
                    data.push(_data);
                }
                
                
                var browserData = [],
                    versionsData = [],
                    i,
                    j,
                    dataLen = data.length,
                    drillDataLen,
                    brightness;


                // Build the data arrays
                for (i = 0; i < dataLen; i += 1) {

                    // add browser data
                    browserData.push({
                        name: categories[i],
                        y: data[i].y,
                        color: data[i].color
                    });

                    // add version data
                    drillDataLen = data[i].drilldown.data.length;
                    for (j = 0; j < drillDataLen; j += 1) {
                        brightness = 0.2 - (j / drillDataLen) / 5;
                        versionsData.push({
                            name: data[i].drilldown.categories[j],
                            y: data[i].drilldown.data[j],
                            color: Highcharts.Color(data[i].color).brighten(brightness).get()
                        });
                    }
                }

                // Create the chart
                $('#serviceContainer').highcharts({
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Services Cost Chart - '+serviceCollection.at(0).get('batchName')
                    },
                    yAxis: {
                        title: {
                            text: 'Total percent market share'
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: false,
                            shadow: false,
                            center: ['50%', '50%']
                        }
                    },
                    tooltip: {
                        valueSuffix: '%'
                    },
                    series: [{
                        name: 'Browsers',
                        data: browserData,
                        size: '60%',
                        dataLabels: {
                            formatter: function() {
                                return this.y > 5 ? this.point.name : null;
                            },
                            color: 'white',
                            distance: -30
                        }
                    }, {
                        name: 'Versions',
                        data: versionsData,
                        size: '80%',
                        innerSize: '60%',
                        dataLabels: {
                            formatter: function() {
                                // display only if larger than 1
                                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                            }
                        }
                    }]
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.IAMOperationsView;
        this.$el.html(html);
    }
});