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
        this.model.change('dataReady', function(model, val) {
            var date = new Date(MetricsCollection.at(0).get('time'));
            var dataReadIops = [];
            var dataWriteIops = [];
            var dataQueueDepth = [];
            var dataCpuUtilization = [];
            for(var i=0;i<MetricsCollection.length;++i){                               
                dataReadIops.push([MetricsCollection.at(i).get('time'),MetricsCollection.at(i).get('readIOPS')]);  
                dataWriteIops.push([MetricsCollection.at(i).get('time'),MetricsCollection.at(i).get('writeIOPS')]);
                dataQueueDepth.push([MetricsCollection.at(i).get('time'),MetricsCollection.at(i).get('diskQueueDepth')]);
                dataCpuUtilization.push([MetricsCollection.at(i).get('time'),MetricsCollection.at(i).get('cpuUtilization')]);       
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
                        text: MetricsCollection.at(0).get('instance')+' Disk Operations/s'
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
                        text: MetricsCollection.at(0).get('instance')+' Disk Queue Depth'
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
                        text: MetricsCollection.at(0).get('instance')+' CPU-Usage'
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
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.RDSMetricsView({
            metrics: MetricsCollection.toJSON()
        });
        this.$el.html(html);
    }
});