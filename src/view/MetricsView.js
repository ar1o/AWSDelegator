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
            console.log(metricsCollection);
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
                console.log(date2);
                // console.log(date1[0],date1[1],date1[2],date2[0],date2[1]);
                var utcDate = Date.UTC(date1[0],date1[1],date1[2],date2[0],date2[1]);                
                dataNetworkIn.push([utcDate,metricsCollection.at(i).get('networkIn')]);  
                dataNetworkOut.push([utcDate,metricsCollection.at(i).get('networkOut')]);
                dataCpuUtilization.push([utcDate,metricsCollection.at(i).get('cpuUtilization')]);       
            }               
            this.render();
            // $(function () {
            //     $('#container').highcharts({
            //         chart: {
            //             type: 'spline',
            //             zoomType: 'x'
            //         },
            //         title: {
            //             text: 'Network'
            //         },
            //         subtitle: {
            //             text: document.ontouchstart === undefined ?
            //                     'Click and drag in the plot area to zoom in' :
            //                     'Pinch the chart to zoom in'
            //         },
            //         xAxis: {
            //             type: 'datetime',
            //             minRange: 14 * 24 * 3600000 // fourteen days
            //         },
            //         yAxis: {
            //             title: {
            //                 text: 'Exchange rate'
            //             },
            //             min: 0 // this sets minimum values of y to 0

            //         },
            //         legend: {
            //             enabled: false
            //         },
            //         plotOptions: {
            //             area: {
            //                 fillColor: {
            //                     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
            //                     stops: [
            //                         [0, Highcharts.getOptions().colors[0]],
            //                         [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            //                     ]
            //                 },
            //                 marker: {
            //                     radius: 2
            //                 },
            //                 lineWidth: 1,
            //                 states: {
            //                     hover: {
            //                         lineWidth: 1
            //                     }
            //                 },
            //                 threshold: null
            //             }
            //         },

            //         series: [{
            //             type: 'area',
            //             name: 'USD to EUR',
            //             pointStart: data[0][0],
            //             data: data
            //         }]
            //     });
            // });

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