var data = {};
data.title = "title";
data.message = "message";
					var finaldata; 
				     $.ajax({
						type: 'GET',
						data: data,
				        contentType: 'application/json',
                        url: 'http://localhost:3000/test',						
                        success: function(data) {
                            console.log('success');
                            console.log(data);
                           finaldata = data;
                        }
                    });

console.log(finaldata);
 // for (var r in finaldata.Reservations) {
 //        for (var i in finaldata.Reservations[r].Instances) {
 //            var instance = finaldata.Reservations[r].Instances[i];
 //            var state = instance.State.Name;
 //            console.log(instance.InstanceId + " (" + state + ") " + instance.PublicDnsName);            
 //        }
 // }



