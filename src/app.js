var express = require('express');
var app = express();
port = process.env.PORT || 3000;
app.use(require(__dirname + '/server/CORS'));
var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
// create application/json parser 
var jsonParser = bodyParser.json();

require(__dirname + '/server/config.js');

// Front-end code
app.use('/', express.static(__dirname + '/public'));

// Start mongoose and mongo
mongoose.connect(databaseUrl, function(error) {
    if (error) {
        console.log(error);
    }
});
var db = mongoose.connection;
db.on("open", function() {
    require(__dirname + '/server/model/ec2');
    require(__dirname + '/server/model/rds');
    require(__dirname + '/server/model/latest');
    require(__dirname + '/server/model/pricing');
    require(__dirname + '/server/model/billing');
    require(__dirname + '/server/parse/boxPricingParse').getPricing(function() {
        require(__dirname + '/server/parse/scheduler').s3Connect();
    });
});

app.get('/getAccount', require(__dirname + '/server/route/CredentialsRoute').getAccountNumber);
app.get('/getConfiguration', require(__dirname + '/server/route/CredentialsRoute').getConfiguration);
app.get('/getAccountBalance', require(__dirname + '/server/route/CredentialsRoute').getAccountBalance);
app.get('/getS3Region', require(__dirname + '/server/route/CredentialsRoute').getS3Region);
app.get('/getAWSRegion', require(__dirname + '/server/route/CredentialsRoute').getAWSRegion);

app.get('/api/ec2/instances', require(__dirname + '/server/route/ec2Route').instances);
app.get('/api/ec2/metrics', require(__dirname + '/server/route/ec2Route').metrics);
app.get('/api/ec2/operations', require(__dirname + '/server/route/ec2Route').operations);

app.get('/api/rds/instances', require(__dirname + '/server/route/rdsRoute').instances);
app.get('/api/rds/metrics', require(__dirname + '/server/route/rdsRoute').metrics);
app.get('/api/rds/operations', require(__dirname + '/server/route/rdsRoute').operations);

app.get('/api/billing/hourlyCostProduct', require(__dirname + '/server/route/billingRoute').hourlyCostProduct);
app.get('/api/billing/instanceCostAll', require(__dirname + '/server/route/billingRoute').instanceCostAll);
app.get('/api/billing/totalCostProduct', require(__dirname + '/server/route/billingRoute').totalCostProduct);

app.get('/api/billing/groupByMonth', require(__dirname + '/server/route/billingRoute').groupByMonth);
app.get('/api/billing/groupByMonthNF', require(__dirname + '/server/route/billingRoute').groupByMonthNF);

app.get('/api/billing/calcTotalCost', require(__dirname + '/server/route/billingRoute').calcTotalCost);

app.get('/api/billing/rds/instanceCostAll', require(__dirname + '/server/route/rdsBillingRoute').instanceCostAll);
app.get('/api/billing/rds/hourlyCostProduct', require(__dirname + '/server/route/rdsBillingRoute').hourlyCostProduct);

app.get('/api/billing/ec2/operationCost', require(__dirname + '/server/route/billingRoute').operationCost);


app.get('/api/NonFreeBilling/hourlyCostProduct', require(__dirname + '/server/route/NonFreeBillingRoute').hourlyCostProduct);
app.get('/api/NonFreeBilling/instanceCostAll', require(__dirname + '/server/route/NonFreeBillingRoute').instanceCostAll);
app.get('/api/NonFreeBilling/calcFreeTierCost', require(__dirname + '/server/route/NonFreeBillingRoute').calcFreeTierCost);
app.get('/api/NonFreeBilling/totalCostProduct', require(__dirname + '/server/route/NonFreeBillingRoute').totalCostProduct);

app.get('/api/statistics/operations', require(__dirname + '/server/route/OperationsRoute').operations);

app.get('/api/meter/rate', require(__dirname + '/server/route/meterRoute').rate);
app.get('/api/meter/usage', require(__dirname + '/server/route/meterRoute').usage);
app.get('/api/meter/usageTotal', require(__dirname + '/server/route/meterRoute').usageTotal);
app.get('/api/meter/balance', require(__dirname + '/server/route/meterRoute').balance);

app.get('/api/usage/groups', require(__dirname + '/server/route/iamRoute').groups);
app.get('/api/usage/users', require(__dirname + '/server/route/iamRoute').users);
app.get('/api/usage/budget', require(__dirname + '/server/route/budgetRoute').budgets);
app.get('/api/usage/budgetCost', require(__dirname + '/server/route/budgetRoute').cost);
app.get('/api/usage/groupUserService', require(__dirname + '/server/route/budgetRoute').groupUserService);
app.get('/api/usage/userService', require(__dirname + '/server/route/budgetRoute').userService);
app.get('/api/usage/budgetUsage', require(__dirname + '/server/route/budgetRoute').usage);
app.get('/api/usage/userBudgetCost', require(__dirname + '/server/route/budgetRoute').userCost);
app.get('/api/usage/groupServiceUsage', require(__dirname + '/server/route/budgetRoute').groupServiceUsage);
app.get('/api/usage/userServiceUsage', require(__dirname + '/server/route/budgetRoute').userServiceUsage);

app.get('/api/usage/timeBudget', require(__dirname + '/server/route/timeBudgetRoute').timeBudgets);
app.get('/api/usage/timeBudgetUsage', require(__dirname + '/server/route/timeBudgetRoute').timeBudgetUsage);
app.get('/api/usage/timeBudgetCost', require(__dirname + '/server/route/timeBudgetRoute').timeBudgetCost);
app.get('/api/usage/userTimeBudgetCost', require(__dirname + '/server/route/timeBudgetRoute').userTimeCost);
app.get('/api/usage/groupUserTimeService', require(__dirname + '/server/route/timeBudgetRoute').groupUserTimeService);
app.get('/api/usage/timeUserService', require(__dirname + '/server/route/timeBudgetRoute').timeUserService);

app.get('/api/notifications', require(__dirname + '/server/route/notificationsRoute').notifications);
app.get('/api/notifications/seen', require(__dirname + '/server/route/notificationsRoute').updateNotifications);

//
app.get('/api/usage/qusers', require(__dirname + '/server/route/budgetRoute').query_users);
app.get('/api/usage/qgroups', require(__dirname + '/server/route/budgetRoute').query_groups);

app.get('/getUsers', jsonParser, function(req, res) {
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            throw err
        };
        db.collection('ec2Instances').aggregate({
            $project: {
                '_id': 0,
                'Name': 1
            }
        }, function(err) {
            if (err) throw err;
            res.send('db');
        })
    })
});

/* Get the last updated lineitems time for display */
app.get('/time', function(req, res) {
    mongoose.model('Billings').find().limit(1).sort({
        $natural: -1
    }).exec(function(e, d) {
        res.send(d[0].UsageStartDate);
    });
});

/* Set the current balance for credits */
app.post('/setBalance', jsonParser, function(req) {
    require('./server/route/CredentialsRoute').setBalance(req);
});

/* Set when the credits will expire */
app.post('/setExpiration', jsonParser, function(req) {
    require('./server/route/CredentialsRoute').setExpiration(req);
});

/* Set the amount of credits used */
app.post('/setCreditsUsed', jsonParser, function(req) {
    require('./server/route/CredentialsRoute').setCreditsUsed(req);
});

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

/* POST cost budgets to the database */
app.post('/budget', jsonParser, function(req, res) {
    var r = req.body;
    var startDate = r.startDate.split('/');
    var endDate = r.endDate.split('/');
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        var doc = {
            BudgetName: r.budgetName,
            BatchType: r.batchType,
            BatchName: r.batchName,
            StartDate: startDate[2] + '-' + startDate[0] + '-' + startDate[1] + ' ' + '00:00:00',
            EndDate: endDate[2] + '-' + endDate[0] + '-' + endDate[1] + ' ' + '23:00:00',
            Amount: r.amount,
            timeout: r.timeout,
            State: 'valid'
        };
       mongoose.model('Budgets').find({
            BudgetName: doc.BudgetName
        }).exec(function(err, budget) {
            if (err) throw err;
            if(budget != 0) {
                res.send("error, budget for batchName already Exists")
            } else {
                db.collection('budgets').insert(doc, function(err) {
                    if (err) throw err;
                    console.log("Cost budget inserted: ", doc);
                    res.send("success");
                });
            }
        });

        // db.collection('budgets').find({
        //     "BatchName": doc.BatchName,
        //     "BatchType": doc.BatchType
        // }).toArray(function(err, resp) {
        //     if (err) throw err;
        //     if (resp.length != 0) {
        //         console.log("wtf1!!");
        //         res.send("error, budget for batchName already Exists");
        //     } else {
        //         db.collection('budgets').insert(doc, function(err) {
        //             if (err) throw err;
        //             console.log("Cost budget inserted: ", doc);
        //             res.send("success");
        //         });
        //     }
        // });
    });
});

/* POST time budgets to the database */
app.post('/timebudget', jsonParser, function(req, res) {
    var r = req.body;
    var startDate = r.startDate.split('/');
    var endDate = r.endDate.split('/');
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) {
            throw err;
        }
        var doc = {
            TimeBudgetName: r.timebudgetname,
            BatchType: r.batchType,
            BatchName: r.batchName,
            StartDate: startDate[2] + '-' + startDate[0] + '-' + startDate[1] + ' ' + '00:00:00',
            EndDate: endDate[2] + '-' + endDate[0] + '-' + endDate[1] + ' ' + '23:00:00',
            TimeAmount: r.timeamount,
            TimeOut: r.timeout,
            uDecayRate: r.udecay,
            oDecayRate: r.odecay,
            minDB: r.minDB,
            maxDB: r.maxDB,
            timeout: r.timeout,
            State: 'valid'
        };
        if (err) {
            throw err;
        } else {
            require('./server/route/timeBudgetRoute').createGRLSInstances(doc, function(r) {
                if (r == 'error: no associated resources') {
                    res.send("error: no associated resources");
                } else {
                    db.collection('timeBudgets').insert(doc, function(err) {
                        if (err) throw err;
                        console.log("TimeBudget inserted ", doc);
                        res.send("success");
                    });
                }
            });
        }
    });
});

/* POST to remove cost budgets from the database */
app.post('/removeCostBudget', jsonParser, function(req, res) {
    var r = req.body;
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        db.collection('budgets').remove({
            BudgetName: r.budgetName
        });
        res.send("success");
    });
});

/* POST to edit cost budgets in the database */
app.post('/editCostBudget', jsonParser, function(req, res) {
    var r = req.body;
    console.log("editing Cost Budget", r);
    MongoClient.connect(databaseUrl, function(err, db) {
        db.collection('budgets').update({
            BudgetName: r.oldName
        }, {
            $set: {
                BudgetName: r.budgetName,
                BatchType: r.batchType,
                BatchName: r.batchName,
                StartDate: r.startDate,
                EndDate: r.endDate,
                Amount: r.amount,
                timeout: r.timeout,
                State: 'valid'
            }
        });
        res.send("success");
    });
});

/* POST to remove time budgets from the database */
app.post('/removeTimeBudget', jsonParser, function(req, res) {
    var r = req.body;
    MongoClient.connect(databaseUrl, function(err, db) {
        if (err) throw err;
        db.collection('timeBudgets').remove({
            TimeBudgetName: r.budgetName
        });
        db.collection('grlsInstances').remove({
            timeBudgetName: r.budgetName
        });
        res.send("success");
    });
});

/* POST to edit time budget in the database */
app.post('/editTimeBudget', jsonParser, function(req, res) {
    var r = req.body;
    MongoClient.connect(databaseUrl, function(err, db) {
        db.collection('timeBudgets').update({
            TimeBudgetName: r.oldName
        }, {
            $set: {
                TimeBudgetName: r.budgetName,
                BatchType: r.batchType,
                BatchName: r.batchName,
                StartDate: r.startDate,
                EndDate: r.endDate,
                TimeAmount: r.timeamount,
                TimeOut: r.timeout,
                uDecayRate: r.uDecay,
                oDecayRate: r.oDecay,
                minDB: r.minDB,
                maxDB: r.maxDB,
                State: 'valid'
            }
        });
        res.send("success");
    });
});

app.listen(port);

console.log('databaseUrl: ', databaseUrl);
console.log('Server Alert: server started on port %s', port);