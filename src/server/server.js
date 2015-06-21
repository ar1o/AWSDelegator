databaseUrl = 'mongodb://localhost:27017/awsdb';
AWS = require('aws-sdk');
mongoose = require('mongoose');
MongoClient = require('mongodb').MongoClient;
Schema = mongoose.Schema;
awsRegions = ['us-west-1', 'us-west-2', 'us-east-1'];
billingAttributes = ['RateId', 'ProductName', 'UsageType', 'Operation', 'AvailabilityZone', 'ItemDescription',
    'UsageStartDate', 'UsageQuantity', 'Rate', 'Cost', 'user:Volume Id', 'user:Name', 'user:Email', 'ResourceId'];
numericAttirbutes = ['RateId', 'UsageQuantity', 'Rate', 'Cost'];
ec2Metric = ['NetworkIn','NetworkOut','CPUUtilization'];
ec2MetricUnit = ['Bytes','Bytes','Percent'];
rdsMetric = ['CPUUtilization','DatabaseConnections','DiskQueueDepth','ReadIOPS','WriteIOPS'];
rdsMetricUnit = ['Percent','Count','Count','Count/Second','Count/Second'];
s3Region = 'us-east-1';
s3Bucket = 'csvcontainer';
currentBillingCollection = "";
awsCredentials = {
    default: new AWS.SharedIniFileCredentials({
        profile: 'default'
    }),
    dev2: new AWS.SharedIniFileCredentials({
        profile: 'dev2'
    })
};
var express = require('express');
var app = express();
port = process.env.PORT || 3000;
app.use(require('./CORS'));

//Instantiate mongoose schemas
require('./model/ec2');
require('./model/rds');
require('./model/latest');
require('./model/pricing');


// Start mongoose and mongo
mongoose.connect(databaseUrl, function(error) {
    if (error) {
        console.log(error);
    }
});
var db = mongoose.connection;
db.on("open", function() {
    console.log("Database Alert: connected to ", databaseUrl);
    require('./parse/scheduler').s3Connect(function() {
	});
});

app.get('/api/ec2/instances', require('./route/ec2Route').instances);
app.get('/api/ec2/metrics', require('./route/ec2Route').metrics);
app.get('/api/ec2/operationPercentage', require('./route/ec2Route').operationPercentage);

app.get('/api/rds/instances', require('./route/rdsRoute').instances);
app.get('/api/rds/metrics', require('./route/rdsRoute').metrics);

app.get('/api/billing/hourlyCostProduct', require('./route/billingRoute').hourlyCostProduct);
app.get('/api/billing/instanceCostAll', require('./route/billingRoute').instanceCostAll);
app.get('/api/billing/calcFreeTierCost', require('./route/billingRoute').calcFreeTierCost);
app.get('/api/billing/totalCostProduct',require('./route/billingRoute').totalCostProduct);

app.get('/api/NonFreeBilling/hourlyCostProduct', require('./route/NonFreeBillingRoute').hourlyCostProduct);
app.get('/api/NonFreeBilling/instanceCostAll', require('./route/NonFreeBillingRoute').instanceCostAll);
app.get('/api/NonFreeBilling/calcFreeTierCost', require('./route/NonFreeBillingRoute').calcFreeTierCost);
app.get('/api/NonFreeBilling/totalCostProduct',require('./route/NonFreeBillingRoute').totalCostProduct);


function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {
        error: err
    });
}
module.exports = errorHandler;
app.listen(port);
console.log('Server Alert: server started on port %s', port);