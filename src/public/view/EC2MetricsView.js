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
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
            for(var i=0;i<MetricsCollection.length;++i){        
                dataNetworkIn.push([MetricsCollection.at(i).get('time'),MetricsCollection.at(i).get('networkIn')]);  
                dataNetworkOut.push([MetricsCollection.at(i).get('time'),MetricsCollection.at(i).get('networkOut')]);
                dataCpuUtilization.push([MetricsCollection.at(i).get('time'),MetricsCollection.at(i).get('cpuUtilization')]);
            } 
            this.render();

            $(function () {
                $('#networkContainer').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    title: {
                        text: MetricsCollection.at(0).get('instance')+' Network-Usage'
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
                            text: 'Bytes'
                        },
                        min: 0,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
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
                                new Date(this.x) +', '+ this.y;
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
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