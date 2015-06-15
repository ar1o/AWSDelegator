var request = require("request");
var fs=require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
//switch back to mongolab later
var databaseUrl = 'mongodb://localhost:27017/awsdb';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// mongoose.connect(databaseUrl);

var region = 0; //us-east-1
var compType = 0; //generalCompute
var size = 0 //micro

var ProductSchema = new Schema({
    ProductName : {type : String},
    OS : {type : String, default : "N/A"},// (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name']);
    Region : {type : String, required : true}, // (pricingJSON.config.regions[region]['region']);
    boxType : {type : String, required : true}, //(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size]['size'])
    Price : {type : Number, required : true},//(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].Price.USD);
    DateModified : {type: Date, default : Date()}, //Date field added for insert reference
    Storage : { type : String}
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
'http://a0.awsstatic.com/pricing/1/s3/pricing-requests-s3.min.js'];
// 'http://a0.awsstatic.com/pricing/1/s3/pricing-data-transfer-s3.min.js'];
var GP2PricingURL = 'http://a0.awsstatic.com/pricing/1/rds/oracle/pricing-li-standard-deployments.min.js'
var EBSPricingURL = 'http://a0.awsstatic.com/pricing/1/ebs/pricing-ebs.min.js';
//No Micro instances supported with EC2 optimized... 
var dataPricingURL = 'http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js';

var PricingSet = ["http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js", 
"http://a0.awsstatic.com/pricing/1/ec2/rhel-od.min.js", "http://a0.awsstatic.com/pricing/1/ec2/sles-od.min.js",
"http://a0.awsstatic.com/pricing/1/ec2/mswin-od.min.js","http://a0.awsstatic.com/pricing/1/ec2/mswinSQLWeb-od.min.js",
'http://a0.awsstatic.com/pricing/1/rds/mysql/pricing-standard-deployments.min.js', 'http://a0.awsstatic.com/pricing/1/s3/pricing-storage-s3.min.js',
'http://a0.awsstatic.com/pricing/1/s3/pricing-requests-s3.min.js', 'http://a0.awsstatic.com/pricing/1/rds/oracle/pricing-li-standard-deployments.min.js',
'http://a0.awsstatic.com/pricing/1/ebs/pricing-ebs.min.js'];
exports.checkPricing = function (){
    var db = mongoose.connection;
    var usage = mongoose.model('pricing', ProductSchema);
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            console.log('Pricing -- Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Pricing --- Connection established to ', databaseUrl);
        }
        //Temp fix for duplicate pricing values in pricing collection
        db.collection("pricing").drop();
        for(var i =0; 9< PricingSet.length; ++i){
            request({
                uri: PricingSet[i],
            }, 
            function(error, response, body) {
                body=body.substring(body.indexOf("callback")+9,body.length-2);
                //fix any "'s within json document
                pricingJSON = JSON.parse(preprocessJSON(body));
                var item = usage();
                //Regions exists for all products
                item.Region = (pricingJSON.config.regions[region]['region']);
                var OS = pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]
                //If its a box instance
                console.log(OS);
                if(isObject(OS)){
                    item.OS = OS;
                    item.InstanceSize = picringJSON.config.regions[region].instanceTypes[compType].sizes[size]['size'];
                    item.Price = pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].Price.USD;
                }
                //If it is  ... rds
                if(isObject()){

                }
                //If it is ..s3 0 or 1
                if(isObject()){

                }
                //If it is .. gp2
                if(isObject()){

                }
                //If it is .. ebs
                if(isObject()){

                }
                //If it is .. Data
                if(isObject()){

                }
                db.collection("pricing").insert((item.toObject()));
            });
        }
    });
}

        // for(var i=0; i< boxPricingURLs.length; i++){
        //     request({
        //         uri: boxPricingURLs[i],
        //     }, 
        //     function(error, response, body) {
        //         //remove comments
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         //fix any "'s within json document
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();
        //         item.ProductName = 'Amazon Elastic Compute Cloud'; 
        //         item.Region = (pricingJSON.config.regions[region]['region']);     
        //         item.OS = pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name'];
        //         item.InstanceSize = picringJSON.config.regions[region].instanceTypes[compType].sizes[size]['size'];
        //         item.Price = pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].Price.USD;
        //         db.collection("pricing").insert((item.toObject()));
        //     });
        // }
      
        //    request({
        //     uri: rdsPricingURL
        // }, 
        // function(error, response, body) {
        //     //remove comments
        //     body=body.substring(body.indexOf("callback")+9,body.length-2);
        //     //fix any "'s within json document
        //     pricingJSON = JSON.parse(preprocessJSON(body));
        //     var item = usage();      
        //         item.Region = (pricingJSON.config.regions[region]['region']);
        //         item.ProductName = "Amazon RDS Service";
        //         item.TypeName = pricingJSON.config.regions[region].types[0].name;
        //         item.TierName = (pricingJSON.config.regions[region].types[0].tiers[0].name);
        //         item.Price = (pricingJSON.config.regions[region].types[0].tiers[0].Price.USD);
        //         db.collection("pricing").insert((item.toObject()));
        //         // console.log(item);
        //     });

            
        //     // // //DataTransferOut EC2 Good
        //     request({
        //         uri: dataPricingURL,
        //     }, 
        //     function(error, response, body) {
        //         //remove comments
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         //fix any "'s within json document
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();
        //         item.Region = (pricingJSON.config.regions[region]['region']);
        //         //pretty sure the productName is correct
        //         item.TypeName = pricingJSON.config.regions[region].types[1].name;
        //         //2 == dataXferOutInternet;
        //         //1 == upTo10TBout
        //         item.TierName = (pricingJSON.config.regions[region].types[1].tiers[5].name);
        //         item.Price = (pricingJSON.config.regions[region].types[1].tiers[5].Price.USD);
                 
        //         db.collection("pricing").insert((item.toObject()));
        //     });

        //     //EBS  Good
        //     request({
        //         uri: EBSPricingURL,
        //     }, 
            
        //     function(error, response, body) {
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();
        //         item.Region = (pricingJSON.config.regions[region]['region']);
        //         item.ProductName
        //         item.TypeName = pricingJSON.config.regions[region].types[0].name;
        //         item.Price = pricingJSON.config.regions[region].types[0].values[0].Price.USD;
        //         // console.log(item);
        //         db.collection("pricing").insert((item.toObject()));
        //     });
        //     request({
        //         uri: s3PricingURL[0],
        //     }, 
        //     function(error, response, body) {
        //         //remove comments
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         //fix any "'s within json document
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();   
        //         item.ProductName = 'Amazon Simple Storage Service';   
        //         item.Region = (pricingJSON.config.regions[region]['region']);
        //         //firstTB
        //         item.TierName = (pricingJSON.config.regions[region].tiers[0].name);
        //         //General storage
        //         item.Storage = (pricingJSON.config.regions[region].tiers[0].Storages[0].type);
        //         item.Price = (pricingJSON.config.regions[region].tiers[0].Storages[0].Price.USD);;
        //         db.collection("pricing").insert((item.toObject()));
        //         // console.log(item);
        //     });
            
        //     //Tier 1 Requests
        //     request({
        //         uri: s3PricingURL[1],
        //     }, 
            
        //     function(error, response, body) {
        //         //remove comments
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         //fix any "'s within json document
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();
        //         item.Region = (pricingJSON.config.regions[region]['region']);
        //         item.TierName = pricingJSON.config.regions[region].tiers[0].name;
        //         // console.log(item.ProductName);
        //         item.Price = pricingJSON.config.regions[region].tiers[0].Price.USD;
        //         // console.log(item);
        //         db.collection("pricing").insert((item.toObject()));
        //     });

        //     //Tier 2 Requests
        //     request({
        //         uri: s3PricingURL[1],
        //     }, 
            
        //     function(error, response, body) {
        //         //remove comments
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         //fix any "'s within json document
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();
        //         item.Region = (pricingJSON.config.regions[region]['region']);
        //         item.ProductName
        //         item.ProductName = pricingJSON.config.regions[region].tiers[3].name;
        //         // console.log(item.ProductName);
        //         item.Price = pricingJSON.config.regions[region].tiers[3].Price.USD;
        //         // console.log(item);
        //         db.collection("pricing").insert((item.toObject()));
        //     });
            
        //     //GP2 Odd that db.m1.small is associated with the value of .115 and not micro...
        //     request({
        //         uri: GP2PricingURL,
        //     }, 
            
        //     function(error, response, body) {
        //         //remove comments
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         //fix any "'s within json document
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();
        //         item.Region = (pricingJSON.config.regions[region]['region']);
        //         item.ProductName = "";
        //         item.TierName = pricingJSON.config.regions[region].types[0].tiers[1].name;
        //         item.TypeName = pricingJSON.config.regions[region].types[0].name;
        //         // console.log(item.ProductName);
        //         item.Price = pricingJSON.config.regions[region].types[0].tiers[1].Price.USD;
        //         // console.log(item);
        //         db.collection("pricing").insert((item.toObject()));
        //     });

        //     //DataTransferOut
        //     request({
        //         uri: dataPricingURL,
        //     }, 
        //     function(error, response, body) {
        //         //remove comments
        //         body=body.substring(body.indexOf("callback")+9,body.length-2);
        //         //fix any "'s within json document
        //         pricingJSON = JSON.parse(preprocessJSON(body));
        //         var item = usage();
        //         item.TypeName = pricingJSON.config.regions[region].types[2].name;
        //         item.TierName = pricingJSON.config.regions[region].types[2].tiers[1].name;
        //         item.Price = pricingJSON.config.regions[region].types[2].tiers[1].Price.USD;
        //         // console.log(item);
        //         db.collection("pricing").insert((item.toObject()));
        //     });

    //     });
    // }

function preprocessJSON(str) {
	return str.replace(/("(\\.|[^"])*"|'(\\.|[^'])*')|(\w+)\s*:/g,
    function(all, string, strDouble, strSingle, jsonLabel) {
        if (jsonLabel) {
            return '"' + jsonLabel + '": ';
        }
        return all;
    });
};
//Thank you:
//http://stackoverflow.com/questions/11480769/how-can-i-check-if-a-json-is-empty-in-nodejs
function isObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return true;
    }
  }
  return false;
}