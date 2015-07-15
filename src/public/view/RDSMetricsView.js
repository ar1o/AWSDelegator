var RDSMetricsView = Backbone.View.extend({
    className: 'RDSMetricsView',
    
    initialize: function(options) {
        if (!this.model) {
            this.model = new MetricsModel();
        }
        
        this.bindings();
        this.render();
    },

    bindings: function() {
        this.model.change('metricsDataReady', function(model, val) {
            var date = new Date(rdsMetricsCollection.at(0).get('time'));
            var dataReadIops = [];
            var dataWriteIops = [];
            var dataQueueDepth = [];
            var dataCpuUtilization = [];
            var dataDbConnections = [];
            for(var i=0;i<rdsMetricsCollection.length;++i){                               
                dataReadIops.push([rdsMetricsCollection.at(i).get('time'),rdsMetricsCollection.at(i).get('readIOPS')]);  
                dataWriteIops.push([rdsMetricsCollection.at(i).get('time'),rdsMetricsCollection.at(i).get('writeIOPS')]);
                dataQueueDepth.push([rdsMetricsCollection.at(i).get('time'),rdsMetricsCollection.at(i).get('diskQueueDepth')]);
                dataCpuUtilization.push([rdsMetricsCollection.at(i).get('time'),rdsMetricsCollection.at(i).get('cpuUtilization')]); 
                dataDbConnections.push([rdsMetricsCollection.at(i).get('time'),rdsMetricsCollection.at(i).get('dbConnections')]);       
            }   
            this.render();

            $(function () {
                $('#readWriteIopsContainer').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: selectedInstanceCollection.at(0).get('instance')+' Disk Operations'
                    },
                    xAxis: {
                        title : {text : "Time"},
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Count/Second'
                        },
                        min: 0,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null
                        
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br/>'+
                                new Date(this.x) +', '+ this.y.toFixed(4);
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    series: [{
                        name: 'ReadIOPS',
                        data: dataReadIops
                    },
                    {
                        name: 'WriteIOPS',
                        data: dataWriteIops
                    }],
                    navigation: {
                        menuItemStyle: {
                            fontSize: '10px'
                        }
                    }
                });
            });

            $(function () {
                $('#queueDepthContainer').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    title: {
                        text: selectedInstanceCollection.at(0).get('instance')+' Disk Queue Depth'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        title : {text : "Time"},
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Count/Second'
                        },
                        min: 0,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null
                        
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br/>'+
                                new Date(this.x) +', '+ this.y.toFixed(4);
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Disk Queue Depth',
                        data: dataQueueDepth
                    }],
                    navigation: {
                        menuItemStyle: {
                            fontSize: '10px'
                        }
                    }
                });
            });

            $(function () {
                $('#rdsCpuContainer').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    title: {
                        text: selectedInstanceCollection.at(0).get('instance')+' CPU Usage'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        title : {text : "Time"},
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Percentage'
                        },
                        min: 0,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null
                        
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br/>'+
                                new Date(this.x) +', '+ this.y.toFixed(4);
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'CPU Utilizaton',
                        data: dataCpuUtilization
                    }],
                    navigation: {
                        menuItemStyle: {
                            fontSize: '10px'
                        }
                    }
                });
            });

            $(function() {
                $('#dbConnectionsContainer').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    title: {
                        text: selectedInstanceCollection.at(0).get('instance') + ' Database Conenctions'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
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
                            text: 'Count'
                        },
                        min: 0,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null

                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>' + this.series.name + '</b><br/>' +
                                new Date(this.x) + ', ' + this.y;
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Db Connections',
                        data: dataDbConnections
                    }],
                    navigation: {
                        menuItemStyle: {
                            fontSize: '10px'
                        }
                    }
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.RDSMetricsView({
            metrics: rdsMetricsCollection.toJSON()
        });
        this.$el.html(html);
    }
});