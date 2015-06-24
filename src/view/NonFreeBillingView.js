var NonFreeBillingView = Backbone.View.extend({
    className: 'NonFreeBillingView',
    initialize: function(options) {
        
        if (!this.model) {
            this.model = new BillingsModel();
        }

        this.render();
        this.bindings();
    },

    bindings: function() {
        this.model.change('dataReady', function(model, val) {
            this.render();
            var date = TotalNonFreeCostCollection.at(0).get('date').split(' ');
            date1=date[1].substring(0,date[1].length-1);
            //date1=[year,month,date]
            var date1 = date[0].split(/-/);                
            //date2=[hour,minute,second]                
            var date2 = date[1].split(':');

            // console.log(TotalNonFreeCostCollection.at(0).get('date'));           
            $(function () {
                $('#nonfreebillingcontainer').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: TotalNonFreeCostCollection.at(0).get('resourceId')+' Recalculated Cost'
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
                        minorGridLineWidth: 0,
                        gridLineWidth: 0,
                        alternateGridColor: null,                        
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
                        name: 'NonFreeCost',
                        pointInterval: 3600 * 1000,
                        pointStart: Date.UTC(date1[0],date1[1],date1[2],date2[0],date2[1],date2[2]),
                        data: TotalNonFreeCostCollection.pluck('cost')

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
        var html = Handlebars.templates.NonFreeBillingView;
        this.$el.html(html);
    }

});