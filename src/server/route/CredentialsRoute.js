//Should add some sort of verification to make sure that account number and credentials are known to be good
exports.setConfiguration = function(req, res) {
	req.on('data', function(chunk) {
		console.log("Received body data:");
		var value,
			key,
			oldIndex;
    var data;
		var credentials = [];
		var regions = [];
		var i = 0;
        var input = chunk.toString();
        var index = 0;
        //PARSE workaround. It works, but it ain't pretty.
        do{
      		key = input.substring(index, input.indexOf('=', index));
      		value = input.substring(input.indexOf('=', index)+1, input.indexOf('&', index));
      		//To take care of last key: value pair
      		if(index > input.lastIndexOf('&')){
      			value = input.substring(input.lastIndexOf('=')+1, input.lastIndexOf(''));
      			credentials[key]=value;
      			break;
      		}
      		oldIndex=index;
      		index = input.indexOf('&', oldIndex)+1;

      		if(key=="AWS_Regions"){
      			regions[i]=value;
      			i = i + 1;
      		}
      		else{

      			credentials[key]=value;
      		}
      	}
        while(input.indexOf('=', index)!=-1&& index!=0);

      if(credentials["S3_Region"] == undefined || credentials["S3_Region"] == [] ){
        console.log("Please input a S3 Region.\nFailed to update values.");
        return;
      }
	    if(isNaN(credentials["Credits"])){
	    	console.log("Credits entered is not a number.\nFailed to update values.");
	    	return;
	    }      
      credits = credentials["Credits"];

		  s3Region = credentials['S3_Region'];

		  awsRegions = regions;
      console.log("Credentials successfully updated");

    });

    req.on('end', function() {
      // empty 200 OK response for now
      res.redirect(302, '../');
      res.end();
      console.log("Returning to parent page.");
    });

}
exports.setBalance = function(req,res){
  console.log("setBalance",req.data);
  // credits = req.
}
exports.getConfiguration = function(req, res) {
  var data = {account:[{"Number" : awsAccountNumber, "Balance" : credits, "S3BucketRegion" : s3Region, "Regions" : awsRegions, "S3BucketName"  : s3Bucket, "DB_URL" : databaseUrl, "BalanceExp" : creditExp}]};
  res.send(data);
}
exports.getAccountNumber = function(req, res) {
      res.sendStatus(awsAccountNumber);
}
exports.getAccountBalance = function(req, res) {
    res.sendStatus(credits);
}
// exports.getRDSRegion = function(req, res) {
//     res.sendStatus(rdsRegion); 
// }
exports.getS3Region = function (req, res) {
  res.sendStatus(s3Region);
}
exports.getAWSRegion = function (req, res) {
  res.sendStatus(awsRegions);
}