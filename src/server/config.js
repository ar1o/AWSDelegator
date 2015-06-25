var AWS = require('aws-sdk');

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
