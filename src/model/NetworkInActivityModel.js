var NetworkInActivityModel = Backbone.Model.extend({
	initialize: function() {
		// console.log("Init NetworkInActivityModel");
		// this.getInNetworkMetrics();
		this.change('networkInMetrics');


	},

	//GET average CPU usage for 1 hour
	getNetworkInMetrics: function() {
		var self = this;
		var fData;

		for (var i = 0; i < instanceCollection.length; ++i) {
			var val = instanceCollection.at(i).get('instance');
			var rstate = instanceCollection.at(i).get('state');
			if (rstate == "running") {


				var d = new Date();
				var rUnixNow = d.getTime();
				var rEndTime = parseInt(rUnixNow / 1000);
				var rStartTime = rEndTime - 3600

				var params = {
					endTime: 1431440584,
					startTime: (1431440584),
					value: 'i-312254c7',
					metric: 'NetworkIn'
				};
				//params.value = instanceCollection.models[i].attributes.instance;
				params.value = val;
				params.endTime = parseInt(rEndTime - 3000);
				params.startTime = parseInt(rStartTime);

				(function(val, params) {

					$.get('http://localhost:3000/api/network/in', params, function(data) {
						// console.log(data);
						if (data.Datapoints[0].Average) {
							fData = new MetricModel({
								instance: val,
								networkIn: data.Datapoints[0].Average
							});
							networkInMetricCollection.add(fData);

						}
						self.set('networkInMetrics', Date.now());

					});

				})(val, params);

			} else {
				// console.log("instance not running", val);
				fData = new MetricModel({
					instance: val,
					networkIn: 0
				});
				networkInMetricCollection.add(fData);
				self.set('networkInMetrics', Date.now());

			}

		}
	}
});