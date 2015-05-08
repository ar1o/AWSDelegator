var params = {
  EndTime: 1431026722, /* required */
  MetricName: 'CPUUtilization', /* required */
  Namespace: 'AWS/EC2', /* required */
  Period: 3600, /* required */
  StartTime: '2015-05-07T18:03:08.000Z', /* required */
  Statistics: ['Average'],
  Dimensions: [
    {
      Name: 'InstanceId', /* required */
      Value: 'i-448c57b3' /* required */
    },
    /* more items */
  ],
  Unit: 'Percent'
};

$.ajax
({
  type: "POST",
  url: "http://localhost:3000",
  crossDomain:true, 
  dataType: "json",
  data:JSON.stringify(params)
 }).done(function ( data ) {
      alert("ajax callback response:"+JSON.stringify(data));
   })


//defines your routes and their logic
var data = {};
data.title = "title";
data.message = "message";
var result;         

function aws_CloudWatch_result() {
    return $.ajax({
    type: 'GET',
    data: data,
    contentType: 'application/json',
    url: 'http://localhost:3000/test2',                      
    success: function(data) {
        console.log('success');
        // console.log(data);
        result = data;
    }
});
}

aws_CloudWatch_result().done(function(result) {
    console.log(result);
}).fail(function() {
    console.log('FAILED');
});

