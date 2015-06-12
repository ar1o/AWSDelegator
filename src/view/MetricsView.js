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
            this.render();
$(function () {
    $('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Network'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            minRange: 14 * 24 * 3600000 // fourteen days
        },
        yAxis: {
            title: {
                text: 'Exchange rate'
            },
            min: 0 // this sets minimum values of y to 0

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'USD to EUR',
            pointInterval: 3600 * 1000,
            pointStart: Date.UTC(date.getYear(), date.getMonth(), date.getDate()),
            data: metricsCollection.pluck('networkIn')
        }]
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