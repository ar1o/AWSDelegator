var fs = require('fs');
var ec2Parser = require('./src/server/parse/ec2Parse');
var rdsParser = require('./src/server/parse/rdsParse');
MongoClient = require('mongodb').MongoClient;
awsRegions = ['us-west-1', 'us-west-2', 'us-east-1'];
AWS = require('aws-sdk');
mongoose = require('mongoose');
Schema = mongoose.Schema;
databaseUrl = 'mongodb://localhost:27017/awsdb';
awsCredentials = {
    default: new AWS.SharedIniFileCredentials({
        profile: 'default'
    }),
    dev2: new AWS.SharedIniFileCredentials({
        profile: 'dev2'
    })
};
//create /data directory
if (!fs.existsSync(process.cwd() + '/data')) {
    fs.mkdirSync(process.cwd() + '/data');
}

mongoose.connect(databaseUrl, function(error) {
    if (error) {
        console.log(error);
    }
});
var conn = mongoose.connection;

MongoClient.connect(databaseUrl, function(err, db) {
    if (err) throw err;
    console.log("Database Alert: connected to ", databaseUrl);
    db.collection('latest').save({
        _id: '1',
        time: "2015:00:01 00:00:00"
    });
    require('./src/server/model/pricing');
    require('./src/server/model/ec2');
    require('./src/server/model/rds');
    db.createCollection("pricing", function(err, collection) {
        if (err) throw err;
        console.log("Database Alert: 'pricing' collection created");
        //get current free-tier rates
        require('./src/server/BoxPricingCheck').getPricing();
        console.log("Free-tier pricing data retreived")
        db.createCollection("ec2Instances", function(err, collection) {
            if (err) throw err;
            console.log("Database Alert: 'ec2Instances' collection created");
            db.createCollection("rdsInstances", function(err, collection) {
                if (err) throw err;
                console.log("Database Alert: 'rdsInstances' collection created");
                AWS.config.credentials = awsCredentials.dev2;
                rdsParser.parseInstances(function() {   
                    console.log("Parse Alert(rds): Instance parsing completed");
                    AWS.config.credentials = awsCredentials.default;
                    ec2Parser.parseInstances(function() {
                        console.log("Parse Alert(ec2): Instance parsing completed");
                        console.log("Setup script completed, You may now start the server");
                        db.close();
                        mongoose.connection.close(function() {
							process.exit(0);                        	
                        });
                    });
                });
            });
        });
    });
});