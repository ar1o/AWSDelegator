/*
    This file gets the actual prices of various AWS operations cost.
    It enables us to project actual cost of free-tier specifications. 
 */
var request = require("request");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var databaseUrl = 'mongodb://localhost:27017/awsdb';
var mongoose = require('mongoose');
var region = 0; //us-east-1
var compType = 0; //generalCompute
var size = 0 //micro
pricing = {};
// s3Pricing: curl http://aws.amazon.com/<ec2>/pricing/ 2>/dev/null | grep 'model:' | sed -e "s/.*'\(.*\)'.*/http:\\1/"
var pricingURLs = [
    'http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js',
    'http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js',
    'http://a0.awsstatic.com/pricing/1/ec2/pricing-data-transfer-with-regions.min.js',
    'http://a0.awsstatic.com/pricing/1/rds/mysql/pricing-standard-deployments.min.js',
    'http://a0.awsstatic.com/pricing/1/rds/oracle/pricing-li-standard-deployments.min.js',
    'http://a0.awsstatic.com/pricing/1/ebs/pricing-ebs.min.js',
    'http://a0.awsstatic.com/pricing/1/s3/pricing-requests-s3.min.js',
    'http://a0.awsstatic.com/pricing/1/s3/pricing-requests-s3.min.js',
    'http://a0.awsstatic.com/pricing/1/s3/pricing-storage-s3.min.js',
    'https://a0.awsstatic.com/pricing/1/rds/aurora/pricing-piops-deploy.min.js',
    'https://a0.awsstatic.com/pricing/1/rds/aurora/pricing-piops-deploy.min.js'  
];
var usageTypes = ['DataTransfer-Out-Bytes',
                    'DataTransfer-Regional-Bytes',
                    'AWS-Out-Bytes',
                    'InstanceUsage:db.t2.micro',
                    'RDS:GP2-Storage',
                    'EBS:VolumeUsage.gp2',
                    'Requests-Tier1',
                    'Requests-Tier2',
                    'TimedStorage-ByteHrs',
                    'RDS:StorageIOUsage',
                    'RDS:StorageUsage'];
//BoxUsage:t2.micro
var osType = ['Linux','RHEL','SUSE','Windows'];
var boxUsageURLs = [
    "http://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js",
    "http://a0.awsstatic.com/pricing/1/ec2/rhel-od.min.js", 
    "http://a0.awsstatic.com/pricing/1/ec2/sles-od.min.js",
    "http://a0.awsstatic.com/pricing/1/ec2/mswin-od.min.js"
];
var doc = {};

exports.getPricing = function(callback) {
    var index = 0;
    //BoxUsage:t2.micro using boxUsageURLs
    var controller = function(){
        iterator(function(){
            index++;
            if(index < osType.length) controller();
            else{
                pricing['BoxUsage:t2.micro']=doc;
                controller2();
            }
        });
    };
    var iterator = function(_callback){
        request({
                uri: boxUsageURLs[index]
        },
        function(error, response, body) {
            var body = body.substring(body.indexOf("callback") + 9, body.length - 2);
            var pricingJSON = JSON.parse(preprocessJSON(body));

            var _pricing = {};
            for(var p in pricingJSON.config.regions){
                var _region = pricingJSON.config.regions[p];
                _pricing[_region.region] = parseFloat(_region.instanceTypes[0].sizes[0].valueColumns[0].prices.USD);
            }
            doc[osType[index]] = _pricing;
            _callback();
        });
    };

    var index2=0;
    //Pricing data form pricingURLs
    var controller2 = function(){
        iterator2(function(){
            index2++;
            if(index2 < pricingURLs.length) {
                controller2();
            } else {
                //needs to be dynamic(from json url)
                pricing['CloudFront-Out-Bytes']={Price:0.085};
                callback();
            }
        });
    };
    var iterator2 = function(_callback){
        request({
                uri: pricingURLs[index2]
        },
        function(error, response, body) {
            var _body = body.substring(body.indexOf("callback") + 9, body.length - 2);
            var pricingJSON = JSON.parse(preprocessJSON(_body));
            switch(index2){
            case 0://DataTransfer-Out-Bytes
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TypeName = pricingJSON.config.regions[region].types[2].name;
                item.TierName = pricingJSON.config.regions[region].types[2].tiers[1].name;
                item.Price = parseFloat(pricingJSON.config.regions[region].types[2].tiers[1].prices.USD);
                pricing[usageTypes[index2]]=item;
                _callback();
                break;
            case 1://DataTransfer-Regional-Bytes
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TypeName = pricingJSON.config.regions[region].types[1].name;
                item.TierName = (pricingJSON.config.regions[region].types[1].tiers[3].name);
                item.Price = parseFloat(pricingJSON.config.regions[region].types[1].tiers[3].prices.USD);
                pricing[usageTypes[index2]]=item;

                _callback();
                break;
            case 2://AWS-Out-Bytes
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TypeName = pricingJSON.config.regions[region].types[1].name;
                item.TierName = (pricingJSON.config.regions[region].types[1].tiers[5].name);
                item.Price = parseFloat(pricingJSON.config.regions[region].types[1].tiers[5].prices.USD);
                pricing[usageTypes[index2]]=item;

                _callback();
                break;
            case 3://InstanceUsage:db.t2.micro
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.ProductName = "Amazon RDS Service";
                item.TierName = (pricingJSON.config.regions[region].types[0].tiers[0].name);
                item.Price = parseFloat(pricingJSON.config.regions[region].types[0].tiers[0].prices.USD);
                pricing[usageTypes[index2]]=item;

                _callback();
                break;
            case 4://RDS:GP2-Storage
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TierName = pricingJSON.config.regions[region].types[0].tiers[1].name; 
                item.Price = parseFloat(pricingJSON.config.regions[region].types[0].tiers[1].prices.USD);
                pricing[usageTypes[index2]]=item;

                _callback();
                break;
            case 5://EBS:VolumeUsage.gp2
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TypeName = pricingJSON.config.regions[region].types[0].name;
                item.Price = parseFloat(pricingJSON.config.regions[region].types[0].values[0].prices.USD);
                pricing[usageTypes[index2]]=item;

                _callback();
                break;
            case 6://Requests-Tier1
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TierName = pricingJSON.config.regions[region].tiers[0].name;
                item.Price = parseFloat(pricingJSON.config.regions[region].tiers[0].prices.USD);
                pricing[usageTypes[index2]]=item;
                _callback();
                break;
            case 7://Requests-Tier2
                var item = {};
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TierName = pricingJSON.config.regions[region].tiers[3].name;                
                item.Price = parseFloat(pricingJSON.config.regions[region].tiers[3].prices.USD);
                pricing[usageTypes[index2]]=item;
                _callback();
                break;
            case 8://TimedStorage-ByteHrs
                var item = {};
                item.ProductName = 'Amazon Simple Storage Service';
                item.Region = (pricingJSON.config.regions[region]['region']);
                item.TierName = (pricingJSON.config.regions[region].tiers[0].name);                
                item.StorageType = (pricingJSON.config.regions[region].tiers[0].storageTypes[0].type);
                item.Price = parseFloat(pricingJSON.config.regions[region].tiers[0].storageTypes[0].prices.USD);;
                pricing[usageTypes[index2]]=item;
                _callback();
                break;
            case 9://USW2-RDS:StorageIOUsage
                var item = {};
                item.Price = pricingJSON.config.regions[region].rates[1].prices;
                pricing[usageTypes[index2]]=item;
                _callback();
                break;
            case 10://RDS:StorageUsage
                var item = {};
                item.Price = pricingJSON.config.regions[region].rates[0].prices;
                pricing[usageTypes[index2]]=item;
                _callback();
                break;
            }                  
        });            
    };

    controller();
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