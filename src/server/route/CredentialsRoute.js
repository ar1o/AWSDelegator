//Should add some sort of verification to make sure that account number and credentials are known to be good
exports.setCredentials = function(req, res) {
	req.on('data', function(chunk) {
		console.log("Received body data:");
		var value,
			key,
			oldIndex;
		var credentials = [];
		var regions = [];
		var i = 0;
        var input = chunk.toString();
        var index = 0;
        //while input continues to have key:value.
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
// Account_Number=123456789&RDS_Region=us-west-1&S3_Region=us-west-1&AWS_Regions=us-west-1&AWS_Regions=us-west-2&AWS_Regions=us-east-1&Credentials=111&Credits=111
        while(input.indexOf('=', index)!=-1&& index!=0);
        console.log(credentials);
        console.log(regions);
        // console.log(dict['Account_Number']);
        if(isNaN(credentials["Account_Number"])||credentials["Account_Number"].length!=12){
	    	console.log("Invalid Account number entered.\nPlease try again.\nLength of:",credentials["Account_Number"].length);
	    	return;
	    }
	    if(isNaN(credentials["Credits"])){
	    	console.log("Credits entered is not a number.\nPlease try again.");
	    	return;
	    }
	    //awsAccountNumber = '092841396837';
	    awsAccountNumber = credentials[0];
		rdsRegion = credentials[1];
		s3Region = credentials[2];
		// s3Bucket = 'csvcontainer'; //Bucket Name??
		awsRegions = regions;
		console.log(awsRegions, s3Region, awsAccountNumber, rdsRegion);
        
      console.log("Credentials successfully updated");
    });
	//verify account number is numeric
	
    ///Before setting the input values to the actual config variables, do error checking
    /*ACCOunt number == all numbers, length of 12
    RDS and S3 Regions are checkboxes, so there's limited variation. Make sure there is one selected though
    Credentials... other than tring to connect with it and acc #, hard to test
    credits. Its a number...
    AWS_Regions >=1
    */
    //Account# check

	// databaseUrl = 'mongodb://localhost:27017/awsdb';//?
    req.on('end', function() {
      // empty 200 OK response for now
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end();
    });
	// var Account_Number=req.body.Account_Number;http://stackoverflow.com/questions/1799284/how-to-break-exit-from-a-each-function-in-jquery
	// console.log(Account_Number);

	// res.send("AccountNumber" + req.body.Account_Number);
	// console.log(req.body);
	// alert(req);
	// awsAccountNumber = ;
	// rdsRegion = ;
	// s3Region = ;
	// s3Bucket = 'csvcontainer';
	// awsRegions = [];
	// awsCredentials = {
	// 	default: new AWS.SharedIniFileCredentials({
	// 		profile: 'default'
	// 	}),
	// 	dev2: new AWS.SharedIniFileCredentials({
	// 		profile: 'dev2'
	// 	})
	// };

	// databaseUrl = 'mongodb://localhost:27017/awsdb';
	//// res.send();
}