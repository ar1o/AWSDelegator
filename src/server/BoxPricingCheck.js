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
    OS : {type : String, required : true},// (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name']);
    region : {type : String, required : true}, // (pricingJSON.config.regions[region]['region']);
    boxType : {type : String, required : true}, //(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size]['size'])
    prices : {type : Number, required : true},//(pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].prices.USD);
    date : {type: Date, default : Date()} //Date field added for insert reference
});

//ADD URLS as AMAZON CHANGES THIER protocols
var pricingURLS = ["http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js", 
"http://a0.awsstatic.com/pricing/1/ec2/rhel-od.min.js", "http://a0.awsstatic.com/pricing/1/ec2/sles-od.min.js",
"http://a0.awsstatic.com/pricing/1/ec2/mswin-od.min.js","http://a0.awsstatic.com/pricing/1/ec2/mswinSQLWeb-od.min.js"];

exports.checkPricing = function (){
    var db = mongoose.connection;

    var boxUsage = mongoose.model('box', boxTypeSchema);
        MongoClient.connect(databaseUrl, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log('Connection established to ', databaseUrl);
            }
            //Temp fix for duplicate pricing values in pricing collection
            db.collection("pricing").drop();
            
            for(var i=0; i< pricingURLS.length; i++){
                request({
                    uri: pricingURLS[i],
                }, 
                function(error, response, body) {
                    //remove comments
                    body=body.substring(body.indexOf("callback")+9,body.length-2);
                    //fix any "'s within json document
                    pricingJSON = JSON.parse(preprocessJSON(body));

                    var item = boxUsage();      
                    item.OS = (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0]['name']);
                    item.region = (pricingJSON.config.regions[region]['region']);
                    item.boxType = (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size]['size']);
                    item.prices = (pricingJSON.config.regions[region].instanceTypes[compType].sizes[size].valueColumns[0].prices.USD);
                    console.log(item);
                    db.collection("pricing").insert((item.toObject()));
                });
            }
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
