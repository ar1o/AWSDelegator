var EC2MetricsView = Backbone.View.extend({
    className: 'EC2MetricsView',
    
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
            var dataNetworkIn = []
            var dataNetworkOut = []
            var dataCpuUtilization = []
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
                dataNetworkIn.push([utcDate,MetricsCollection.at(i).get('networkIn')]);  
                dataNetworkOut.push([utcDate,MetricsCollection.at(i).get('networkOut')]);
                dataCpuUtilization.push([utcDate,MetricsCollection.at(i).get('cpuUtilization')]);       
            }               
            this.render();

            $(function () {
                $('#networkContainer').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: MetricsCollection.at(0).get('instance')+' Network-Usage'
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
                        text: MetricsCollection.at(0).get('instance')+' CPU-Usage'
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
        var html = Handlebars.templates.EC2MetricsView({
            metrics: MetricsCollection.toJSON()
        });
        this.$el.html(html);
    }
});