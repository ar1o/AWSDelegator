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
                var date = MetricsCollection.at(i).get('time').split('T');
                date1=date[1].substring(0,date[1].length-1);
                //date1=[year,month,date]
                var date1 = date[0].split(/-/);
                date1[1]= date1[1]-1;               
                //date2=[hour,minute,second]                
                var date2 = date[1].split(':');
                date2[2] = date2[2].substring(0,date2[2].indexOf('.')); 
                var utcDate = Date.UTC(date1[0],date1[1],date1[2],date2[0],date2[1]);                
                dataReadIops.push([utcDate,MetricsCollection.at(i).get('readIOPS')]);  
                dataWriteIops.push([utcDate,MetricsCollection.at(i).get('writeIOPS')]);
                dataQueueDepth.push([utcDate,MetricsCollection.at(i).get('diskQueueDepth')]);
                dataCpuUtilization.push([utcDate,MetricsCollection.at(i).get('cpuUtilization')]);       
            }               
            this.render();

            $(function () {
                $('#readWriteIopsContainer').highcharts({
                    chart: {
                        zoomType: 'x'
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
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
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
                        zoomType: 'x'
                    },
                    title: {
                        text: MetricsCollection.at(0).get('instance')+' Disk Queue Depth'
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
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
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
                        zoomType: 'x'
                    },
                    title: {
                        text: MetricsCollection.at(0).get('instance')+' CPU-Usage'
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
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
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