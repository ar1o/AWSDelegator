var CPUActivityModel = Backbone.Model.extend({
	initialize: function() {
		// console.log("Init CPUActivityMoel model");
		// this.getCPUMetrics();
		this.change('cpuMetrics');


	},

	//GET average CPU usage for 1 hour
	getCPUMetrics: function() {
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
					metric: 'CPUUtilization'
				};
				//params.value = instanceCollection.models[i].attributes.instance;
				params.value = val;
				params.endTime = parseInt(rEndTime - 3000);
				params.startTime = parseInt(rStartTime);

				(function(val, params) {

					$.get('http://localhost:3000/api/cpu', params, function(data) {
						// console.log(data);
						if (data.Datapoints[0].Average) {
							// console.log(params.value, data.Datapoints[0].Average);
							// console.log(params.value, data);
							fData = new MetricModel({
								instance: val,
								cpu: data.Datapoints[0].Average
							});
							cpuMetricCollection.add(fData);

						}
						self.set('cpuMetrics', Date.now());

					});

				})(val, params);

			} else {
				// console.log("instance not running", val);
				fData = new MetricModel({
					instance: val,
					cpu: 0
				});
				cpuMetricCollection.add(fData);
				self.set('cpuMetrics', Date.now());

			}

		}
	}
});