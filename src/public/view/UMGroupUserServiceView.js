var UMGroupUserServiceView = Backbone.View.extend({
    className: 'UMGroupUserServiceView',

    initialize: function(options) {
        if (!this.model) {
            this.model = new UsageMonitorModel();
        }
        this.ec2InstancesView = new EC2InstancesView();
        this.rdsInstancesView = new RDSInstancesView();
        this.user = "";
        this.bindings();
        this.render();
    },

    setUser: function(user){
        this.user = user;
    },

    bindings: function() {
        var self = this;
        this.model.change('groupUserServiceDataReady', function(model, val) {
            this.render();
            $(function() {
                var _data = [];
                var k=0;
                var data = [];
                var categories = [];
                var colors = Highcharts.getOptions().colors;
                for(var i in groupUserServiceCollection.at(0).get('services')){
                    categories.push(i);
                    _data = {};
                    _data['y']=Math.round((groupUserServiceCollection.at(0).get('services')[i].percentage) * 100) / 100;
                    _data['color']=colors[k];
                    var _drilldown = {
                        name: i+' resourceIds'
                    }
                    var _categories = [], _data2 = [];
                    for(var j in groupUserServiceCollection.at(0).get('services')[i].resourceId){
                        _categories.push(j);
                        _data2.push(Math.round((groupUserServiceCollection.at(0).get('services')[i].resourceId[j].percentage) * 100) / 100);
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

                var budgetIndex = budgetIndexCollection.at(0).get('index');
                $('#groupUserServiceContainer').highcharts({
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Services Cost Chart - '+budgetCollection.at(budgetIndex).get('budgetName')+' - '+self.user
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
                            center: ['50%', '50%'],
                            point: {
                                events: {
                                    click: function(event) {
                                        if(/^i/.test(this.name)){
                                            self.ec2InstancesView.model.setEC2SelectedInstance(this.name, true);
                                            self.ec2InstancesView.updateViews(this.name);
                                            window.location.hash = '#/EC2Instances';
                                        }else if(/^arn:aws:rds/.test(this.name)){                                            
                                            var dbName = this.name.substring(this.name.lastIndexOf(':')+1,this.name.length);
                                            self.rdsInstancesView.model.setRDSSelectedInstance(dbName, true);
                                            self.rdsInstancesView.updateViews(dbName);
                                            window.location.hash = '#/RDSInstances';
                                        }
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        valueSuffix: '%'
                    },
                    series: [{
                        name: 'AWS Service',
                        data: browserData,
                        size: '60%',
                        dataLabels: {
                            formatter: function() {
                                // if()
                                return this.y > 0 ? this.point.name : null;
                            },
                            color: 'white',
                            distance: -30
                        }
                    }, {
                        name: 'ResourceId',
                        data: versionsData,
                        size: '80%',
                        innerSize: '60%',
                        dataLabels: {
                            formatter: function() {
                                // display only if larger than 1
                                if(/vol/.test(this.point.name)){
                                    return null;
                                }else if(/null/.test(this.point.name)){
                                    return null;
                                }else{
                                    return this.y > 0 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                                }
                            }
                        }
                    }]
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.UMGroupUserServiceView;
        this.$el.html(html);
    }
});