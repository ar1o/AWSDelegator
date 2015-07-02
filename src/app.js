var express = require('express');
var app = express();
port = process.env.PORT || 3000;
var bodyParser= require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended : true
// }));
app.use(require(__dirname +'/server/CORS'));
require(__dirname +'/server/config.js');
// Front-end code
app.use('/',express.static(__dirname + '/public'));

// Start mongoose and mongo
mongoose.connect(databaseUrl, function(error) {
    if (error) {
        console.log(error);
    }
});

var db = mongoose.connection;
db.on("open", function() {
    require(__dirname +'/server/model/ec2');
    require(__dirname +'/server/model/rds');
    require(__dirname +'/server/model/latest');
    require(__dirname +'/server/model/pricing');
    require(__dirname +'/server/model/billing');
    require(__dirname +'/server/BoxPricingCheck').getPricing(function(){
        require(__dirname +'/server/parse/scheduler').s3Connect();
    });
});

app.get('/api/ec2/instances', require(__dirname +'/server/route/ec2Route').instances);
app.get('/api/ec2/metrics', require(__dirname +'/server/route/ec2Route').metrics);
app.get('/api/ec2/operations', require(__dirname +'/server/route/ec2Route').operations);

app.get('/api/rds/instances', require(__dirname +'/server/route/rdsRoute').instances);
app.get('/api/rds/metrics', require(__dirname +'/server/route/rdsRoute').metrics);
app.get('/api/rds/operations', require(__dirname +'/server/route/rdsRoute').operations);

app.get('/api/billing/hourlyCostProduct', require(__dirname +'/server/route/billingRoute').hourlyCostProduct);
app.get('/api/billing/instanceCostAll', require(__dirname +'/server/route/billingRoute').instanceCostAll);
app.get('/api/billing/calcFreeTierCost', require(__dirname +'/server/route/billingRoute').calcFreeTierCost);
app.get('/api/billing/totalCostProduct',require(__dirname +'/server/route/billingRoute').totalCostProduct);

app.get('/api/billing/calcTotalCost',require(__dirname +'/server/route/billingRoute').calcTotalCost);

app.get('/api/billing/rds/instanceCostAll', require(__dirname +'/server/route/rdsBillingRoute').instanceCostAll);
app.get('/api/billing/rds/hourlyCostProduct', require(__dirname +'/server/route/rdsBillingRoute').hourlyCostProduct);

app.get('/api/NonFreeBilling/hourlyCostProduct', require(__dirname +'/server/route/NonFreeBillingRoute').hourlyCostProduct);
app.get('/api/NonFreeBilling/instanceCostAll', require(__dirname +'/server/route/NonFreeBillingRoute').instanceCostAll);
app.get('/api/NonFreeBilling/calcFreeTierCost', require(__dirname +'/server/route/NonFreeBillingRoute').calcFreeTierCost);
app.get('/api/NonFreeBilling/totalCostProduct',require(__dirname +'/server/route/NonFreeBillingRoute').totalCostProduct);

app.get('/api/statistics/operations',require(__dirname +'/server/route/OperationsRoute').operations);

app.get('/api/meter/rate',require(__dirname +'/server/route/meterRoute').rate);
app.get('/api/meter/usage',require(__dirname +'/server/route/meterRoute').usage);
app.get('/api/meter/balance',require(__dirname +'/server/route/meterRoute').balance);

app.post('/setCredentials',require(__dirname +'/server/route/CredentialsRoute').setCredentials);

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