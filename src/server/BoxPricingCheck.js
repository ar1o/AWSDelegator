var request = require("request");
var fs=require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var databaseUrl = 'mongodb://localhost:27017/awsdb';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// mongoose.connect(databaseUrl);

var region = 0; //us-east-1
var compType = 0; //generalCompute
var size = 0 //micro

var boxTypeSchema = new Schema({
    ProductName : {type : String},
    OS : {type : String, default : null},// (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name']);
    AvailabilityZone : {type : String, required : true}, // (pricingJSON.config.regions[region]['region']);
    boxType : {type : String, required : true}, //(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size]['size'])
    prices : {type : Number, required : true},//(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].prices.USD);
    date : {type: Date, default : Date()}, //Date field added for insert reference
    storageType : { type : String}
});

//ADD URLS as AMAZON CHANGES THIER protocols
var boxPricingURLs = ["http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js", 
"http://a0.awsstatic.com/pricing/1/ec2/rhel-od.min.js", "http://a0.awsstatic.com/pricing/1/ec2/sles-od.min.js",
"http://a0.awsstatic.com/pricing/1/ec2/mswin-od.min.js","http://a0.awsstatic.com/pricing/1/ec2/mswinSQLWeb-od.min.js"];

//MANY RDS values available...This will do for now though.
var rdsPricingURL = 'http://a0.awsstatic.com/pricing/1/rds/mysql/pricing-standard-deployments.min.js';
//Up to date as of June 8... Add exec/unix command ability to repopulate these URLS dynamically...
// curl http://aws.amazon.com/<ec2>/pricing/ 2>/dev/null | grep 'model:' | sed -e "s/.*'\(.*\)'.*/http:\\1/"
var s3PricingURL = ['http://a0.awsstatic.com/pricing/1/s3/pricing-storage-s3.min.js',
'http://a0.awsstatic.com/pricing/1/s3/pricing-requests-s3.min.js',
'http://a0.awsstatic.com/pricing/1/s3/pricing-data-transfer-s3.min.js'];

var dataPricingURL = 'http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js';

exports.checkPricing = function (){
    var db = mongoose.connection;

    var usage = mongoose.model('pricing', boxTypeSchema);
        MongoClient.connect(databaseUrl, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to ', databaseUrl);
            }
            //Temp fix for duplicate pricing values in pricing collection
            db.collection("pricing").drop();
            
            //boxPricingLoop    GOOD
            for(var i=0; i< boxPricingURLs.length; i++){
                request({
                    uri: boxPricingURLs[i],
                }, 
                function(error, response, body) {
                    //remove comments
                    body=body.substring(body.indexOf("callback")+9,body.length-2);
                    //fix any "'s within json document
                    pricingJSON = JSON.parse(preprocessJSON(body));

                    var item = usage();
                    item.ProductName = 'Amazon Elastic Compute Cloud';      
                    item.OS = (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name']);
                    item.AvailabilityZone = (pricingJSON.config.regions[region]['region']);
                    item.boxType = (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size]['size']);
                    item.prices = (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].prices.USD);
                    db.collection("pricing").insert((item.toObject()));
                });
            }

            // //rdsPricingLoop
            request({
                uri: rdsPricingURL
            }, 
            function(error, response, body) {
                //remove comments
                body=body.substring(body.indexOf("callback")+9,body.length-2);
                //fix any "'s within json document
                pricingJSON = JSON.parse(preprocessJSON(body));
                var item = usage();      
                item.AvailabilityZone = (pricingJSON.config.regions[region]['region']);
                item.ProductName = "Amazon RDS Service";
                item.boxType = (pricingJSON.config.regions[region].types[0].tiers[0].name);
                item.prices = (pricingJSON.config.regions[region].types[0].tiers[0].prices.USD);
                db.collection("pricing").insert((item.toObject()));
            });

            // //s3PricingLoop
            // for(var i=0; i< s3PricingURL.length; i++){
            request({
                uri: s3PricingURL[0],
            }, 
            function(error, response, body) {
                //remove comments
                body=body.substring(body.indexOf("callback")+9,body.length-2);
                //fix any "'s within json document
                pricingJSON = JSON.parse(preprocessJSON(body));
                var item = usage();   
                item.ProductName = 'Amazon Simple Storage Service';   
                item.AvailabilityZone = (pricingJSON.config.regions[region]['region']);
                //firstTB
                item.boxType = (pricingJSON.config.regions[region].tiers[0].name);
                //General storage
                item.storageType = (pricingJSON.config.regions[region].tiers[0].storageTypes[0].type);
                item.prices = (pricingJSON.config.regions[region].tiers[0].storageTypes[0].prices.USD);;
                db.collection("pricing").insert((item.toObject()));
            });
            
            // //DataTransferOut
            request({
                uri: dataPricingURL,
            }, 
            function(error, response, body) {
                //remove comments
                body=body.substring(body.indexOf("callback")+9,body.length-2);
                //fix any "'s within json document
                pricingJSON = JSON.parse(preprocessJSON(body));
                var item = usage();
                item.AvailabilityZone = (pricingJSON.config.regions[region]['region']);
                //pretty sure the productName is correct
                item.ProductName = 'DataTransfer-Out-Bytes';
                //2 == dataXferOutInternet;
                //1 == upTo10TBout
                item.boxType = (pricingJSON.config.regions[region].types[2].tiers[1].name);
                item.prices = (pricingJSON.config.regions[region].types[2].tiers[1].prices.USD);
                // console.log(item);
                db.collection("pricing").insert((item.toObject()));
            });

            //DataTransfer-Regional
            request({
                uri: dataPricingURL,
            }, 
            
            function(error, response, body) {
                //remove comments
                body=body.substring(body.indexOf("callback")+9,body.length-2);
                //fix any "'s within json document
                pricingJSON = JSON.parse(preprocessJSON(body));
                var item = usage();
                item.AvailabilityZone = (pricingJSON.config.regions[region]['region']);
                //pretty sure the productName is correct
                item.ProductName = 'DataTransfer-Regional-Bytes';
                item.prices = (pricingJSON.config.regions[region].regionalDataTransfer.prices.USD);
                db.collection("pricing").insert((item.toObject()));
            });

            // datXferOutInternet wrong info here
            request({
                uri: dataPricingURL,
            }, 
            
            function(error, response, body) {
                //remove comments
                body=body.substring(body.indexOf("callback")+9,body.length-2);
                //fix any "'s within json document
                pricingJSON = JSON.parse(preprocessJSON(body));
                var item = usage();
                item.AvailabilityZone = (pricingJSON.config.regions[region]['region']);
                //pretty sure the productName is correct
                item.ProductName = 'AWS-Out-Bytes//datXferOutInternet';
                //2 == dataXferOutInternet;
                //1 == upTo10TBout
                item.prices = (pricingJSON.config.regions[region].types[2].tiers[1].prices.USD);
                
                db.collection("pricing").insert((item.toObject()));
            });
        });
    }

function preprocessJSON(str) {
	return str.replace(/("(\\.|[^"])*"|'(\\.|[^'])*')|(\w+)\s*:/g,
    function(all, string, strDouble, strSingle, jsonLabel) {
        if (jsonLabel) {
            return '"' + jsonLabel + '": ';
        }
        return all;
    });
};
