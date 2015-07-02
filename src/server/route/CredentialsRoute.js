exports.setCredentials = function(req, res) {
	console.log("Set crecdentials function has been entered!")
	var Account_Number=req.body.Account_Number;
	console.log(Account_Number);

	res.send("AccountNumber" + req.body.Account_Number);
	console.log(req.body);
	alert(req);
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