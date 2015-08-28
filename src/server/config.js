MongoClient = require('mongodb').MongoClient;
AWS = require('aws-sdk');
mongoose = require('mongoose');
Schema = mongoose.Schema;
require('express');
require('./model/ec2');
require('./model/rds');
require('./model/iam');
require('./model/latest');
require('./model/pricing');
require('./model/billing');
require('./model/budget');
require('./model/timeBudget');
require('./model/notification');
require('./model/usageMeter');
require('./model/grls');
require('./model/grlsLineItem');

billingAttributes = ['RateId', 'ProductName', 'UsageType', 'Operation', 'AvailabilityZone', 'ItemDescription',
    'UsageStartDate', 'UsageQuantity', 'Rate', 'Cost', 'user:Name', 'user:Group', 'user:Email' , 'ResourceId'];

numericAttirbutes = ['RateId', 'UsageQuantity', 'Rate', 'Cost'];

ec2Metric = ['NetworkIn','NetworkOut','CPUUtilization'];

ec2MetricUnit = ['Bytes','Bytes','Percent'];

rdsMetric = ['CPUUtilization','DatabaseConnections','DiskQueueDepth','ReadIOPS','WriteIOPS'];

rdsMetricUnit = ['Percent','Count','Count','Count/Second','Count/Second'];
awsCredentials = {
    default: new AWS.SharedIniFileCredentials({
        profile: 'default'
    })
};

/*User Configuration Data*/
//Account number can be found at https://console.aws.amazon.com/billing/home#/account
awsAccountNumber = '092841396837';
//Dependent on where the mongo database is hosted...
databaseUrl = 'mongodb://localhost:27017/awsdb';
//Name of S3Bucket where billing is saved to. Can be found at https://console.aws.amazon.com/billing/home#/preferences
s3Bucket = 'csvcontainer';
//Region where S3Bucket is hosted
s3Region = 'us-east-1';
//The Regions where your RDS and EC2 Instances are hosted
awsRegions = ['us-west-1', 'us-west-2','us-east-1'];
//Values can be found at https://console.aws.amazon.com/billing/home#/credits
credits = '';
creditExp = '';
creditsUsed = '';
