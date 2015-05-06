//defines your routes and their logic
console.log("test");

var data = {};
data.title = "title";
data.message = "message";
var result;					

function aws_result() {
    return $.ajax({
    type: 'GET',
    data: data,
    contentType: 'application/json',
    url: 'http://localhost:3000/test',                      
    success: function(data) {
        console.log('success');
        console.log(data);
        result = data;
    }
});
}







