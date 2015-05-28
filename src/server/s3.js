/*
	s3connect gets large csv.zip file and extracts it in /data/
*/
var compress = require('adm-zip'); 
var fileS = require('fs'); //file reader-writer library
var AWS = require('aws-sdk'); //AWS SDK
var credentials = new AWS.SharedIniFileCredentials({
    profile: 'default'
});
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';
var billing = (require('./billing')); //S3 bucket connection
// Express import


exports.s3connect = function (req, res) {
	console.log("s3");
	setInterval(function(){
    var okey;
	console.log("starting download of test.zip");
    var params = {
    	//fix the bucket name to be flexible.
        Bucket: 'ario'

    };
    var s3 = new AWS.S3();
    s3.listObjects(params, function(err, data) {
        // if (err) console.log(err, err.stack); // an error occurred
        // else console.log(data); // successful response

        okey = data.Contents[2].Key;
        console.log(okey);

        var params_ = {
            Bucket: 'ario',
            Key: okey
        };
        var file = fileS.createWriteStream('test.zip');
        s3.getObject(params_).createReadStream().pipe(file);
       // res.send("File retrieved: " + okey);

        file.on('close', function() {
            console.log("Billing data retrieved from S3 Bucket and unzipped");
            var unzip = new compress('test.zip');
            try {
                unzip.extractAllTo("data", true);
                billing.getBilling();
            } catch (e) {
                console.log(e);
            }
        });

    });

}, 1000 * 60 * .5);
};
