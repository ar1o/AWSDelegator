MongoClient = require('mongodb').MongoClient;
AWS = require('aws-sdk');
mongoose = require('mongoose');
Schema = mongoose.Schema;
require('./model/ec2');
require('./model/rds');
require('./model/latest');
require('./model/pricing');
require('./model/billing');

awsAccountNumber = '092841396837';
rdsRegion = 'us-east-1';
s3Region = 'us-east-1';
s3Bucket = 'csvcontainer';
awsRegions = ['us-west-1', 'us-west-2', 'us-east-1'];
awsCredentials = {
    default: new AWS.SharedIniFileCredentials({
        profile: 'default'
    }),
    dev2: new AWS.SharedIniFileCredentials({
        profile: 'dev2'
    })
};

databaseUrl = 'mongodb://localhost:27017/awsdb';

billingAttributes = ['RateId', 'ProductName', 'UsageType', 'Operation', 'AvailabilityZone', 'ItemDescription',
    'UsageStartDate', 'UsageQuantity', 'Rate', 'Cost', 'user:Volume Id', 'user:Name', 'user:Email', 'ResourceId'];
numericAttirbutes = ['RateId', 'UsageQuantity', 'Rate', 'Cost'];
ec2Metric = ['NetworkIn','NetworkOut','CPUUtilization'];
ec2MetricUnit = ['Bytes','Bytes','Percent'];
rdsMetric = ['CPUUtilization','DatabaseConnections','DiskQueueDepth','ReadIOPS','WriteIOPS'];
rdsMetricUnit = ['Percent','Count','Count','Count/Second','Count/Second'];