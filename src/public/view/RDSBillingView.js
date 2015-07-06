var RDSBillingView = Backbone.View.extend({
    className: 'RDSBillingView',
    initialize: function(options) {        
        if (!this.model) {
            this.model = new BillingsModel();
        }

        this.render();
        this.bindings();
    },
    updateView: function(selected){
        this.model.calculateOperationCost(selected,totalCostInstancesCollection.at(0).get('resourceId'),'Amazon RDS Service');
    },
    bindings: function() {
        this.model.change('operationDataReady', function(model, val) {
            this.render();
            var date = totalCostInstancesCollection.at(0).get('date').split(' ');
            date1=date[1].substring(0,date[1].length-1);
            //date1=[year,month,date]
            var date1 = date[0].split(/-/);
            date1[1]= date1[1]-1;             
            //date2=[hour,minute,second]                
            var date2 = date[1].split(':');
            var resId = totalCostInstancesCollection.at(0).get('resourceId');
            resId = resId.substring(resId.lastIndexOf(':') + 1, resId.length);
            if (operationCostCollection.length != 0) {
                var opDate = operationCostCollection.at(0).get('date').split(' ');
                var opDate1 = opDate[0].split(/-/);
                var opDate2 = opDate[1].split(':');
                var month = parseInt(opDate1[1]);
                opDate1[1] = month - 1;
                var opData = [];
                for (var i = 0; i < operationCostCollection.length; ++i) {
                    var opDate = operationCostCollection.at(i).get('date').split(' ');
                    var opDate1 = opDate[0].split(/-/);
                    var opDate2 = opDate[1].split(':');
                    var month = parseInt(opDate1[1]);
                    opDate1[1] = month - 1;
                    var _opDate = Date.UTC(opDate1[0], opDate1[1], opDate1[2], opDate2[0], opDate2[1], opDate2[2]);
                    opData.push([_opDate, operationCostCollection.at(i).get('cost')]);
                }

                $(function() {
                    $('.RDSBillingView').highcharts({
                        chart: {
                            zoomType: 'x',
                            backgroundColor: '#f7f7f7'
                        },
                        title: {
                            text: resId + ' Cost'
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
                                text: 'Price (USD)'
                            },
                            min: 0,
                            minorGridLineWidth: 0.5,
                            gridLineWidth: 0.5,
                            alternateGridColor: null,
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>' + this.series.name + '</b><br/>' +
                                    new Date(this.x) + ', ' + this.y.toFixed(4);
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        series: [{
                            name: 'Cost',
                            pointInterval: 3600 * 1000,
                            pointStart: Date.UTC(date1[0], date1[1], date1[2], date2[0], date2[1], date2[2]),
                            data: totalCostInstancesCollection.pluck('cost')

                        }, {
                            name: operationCostCollection.at(0).get('operation'),
                            color: operationCostCollection.at(0).get('color'),
                            pointInterval: 3600 * 1000,
                            pointStart: opData[0][0],
                            data: opData
                        }],
                        navigation: {
                            menuItemStyle: {
                                fontType: 'Roboto',
                                fontSize: '10px'
                            }
                        }
                    });
                });
            }
        }.bind(this));

        this.model.change('dataReady', function(model, val) {
            this.render();
            var date = totalCostInstancesCollection.at(0).get('date').split(' ');
            date1=date[1].substring(0,date[1].length-1);
            //date1=[year,month,date]
            var date1 = date[0].split(/-/);
            date1[1]= date1[1]-1;             
            //date2=[hour,minute,second]                
            var date2 = date[1].split(':');
            var resId = totalCostInstancesCollection.at(0).get('resourceId');
            resId = resId.substring(resId.lastIndexOf(':')+1,resId.length);
                    
            $(function () {
                $('.RDSBillingView').highcharts({
                    chart: {
                        zoomType: 'x',
                        backgroundColor: '#f7f7f7'
                    },
                    title: {
                        text: resId+' Cost'
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
                            text: 'Price (USD)'
                        },
                        min: 0,
                        minorGridLineWidth: 0.5,
                        gridLineWidth: 0.5,
                        alternateGridColor: null,                        
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
                        name: 'Cost',
                        pointInterval: 3600 * 1000,
                        pointStart: Date.UTC(date1[0],date1[1],date1[2],date2[0],date2[1],date2[2]),
                        data: totalCostInstancesCollection.pluck('cost')

                    }],
                    navigation: {
                        menuItemStyle: {
                            fontType : 'Roboto',
                            fontSize: '10px'
                        }
                    }
                });
            });
        }.bind(this));
    },

    render: function() {
        var html = Handlebars.templates.RDSBillingView({
            billing: totalCostInstancesCollection.toJSON(),
        });
        this.$el.html(html);
    }
});