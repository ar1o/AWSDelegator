MongoClient = require('mongodb').MongoClient;
AWS = require('aws-sdk');
mongoose = require('mongoose');
require('express');
Schema = mongoose.Schema;
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
awsAccountNumber = '092841396837';
s3Region = 'us-east-1';
s3Bucket = 'csvcontainer';
awsRegions = ['us-west-1', 'us-west-2',
     'us-east-1'];
databaseUrl = 'mongodb://localhost:27017/awsdb'; //?
credits = "";
creditExp = '';
creditsUsed = "";
//Perhaps it would be good to move either these values ^, or everything else to another file
