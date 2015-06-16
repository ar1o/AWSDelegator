var MetricsView = Backbone.View.extend({
    className: 'MetricsView',
    
    initialize: function(options) {
        if (!this.model) {
            this.model = new MetricsModel();
        }
        
        this.bindings();
        this.render();
    },

    //Check for when the data is read and renders the page
    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            var date = new Date(metricsCollection.at(0).get('time'));
            var dataNetworkIn = []
            var dataNetworkOut = []
            var dataCpuUtilization = []
            for(var i=0;i<metricsCollection.length;++i){                
                var date = metricsCollection.at(i).get('time').split('T');
                date1=date[1].substring(0,date[1].length-1);
                //date1=[year,month,date]
                var date1 = date[0].split(/-/);                
                //date2=[hour,minute,second]                
                var date2 = date[1].split(':');
                date2[2] = date2[2].substring(0,date2[2].indexOf('.')); 
                var utcDate = Date.UTC(date1[0],date1[1],date1[2],date2[0],date2[1]);                
                dataNetworkIn.push([utcDate,metricsCollection.at(i).get('networkIn')]);  
                dataNetworkOut.push([utcDate,metricsCollection.at(i).get('networkOut')]);
                dataCpuUtilization.push([utcDate,metricsCollection.at(i).get('cpuUtilization')]);       
            }               
            this.render();

            $(function () {
                $('#networkContainer').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: metricsCollection.at(0).get('instance')+' Network-Usage'
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Bytes'
                        },
                        min: 0,
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
                        alternateGridColor: null
                        
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br/>'+
                                new Date(this.x) +', '+ this.y;
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    series: [{
                        name: 'NetworkIn',
                        data: dataNetworkIn
                    },
                    {
                        name: 'NetworkOut',
                        data: dataNetworkOut
                    }],
                    navigation: {
                        menuItemStyle: {
                            fontSize: '10px'
                        }
                    }
                });
            });

            $(function () {
                $('#cpuContainer').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: metricsCollection.at(0).get('instance')+' CPU-Usage'
                    },
                    xAxis: {
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
                                new Date(this.x) +', '+ this.y;
                        }
                    },
                    legend: {
                        enabled: true
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
        var html = Handlebars.templates.MetricsView({
            metrics: metricsCollection.toJSON()
        });
        this.$el.html(html);
    }
});