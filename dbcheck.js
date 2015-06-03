var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var db = 'mongodb://localhost:27017/billingtestdb';

db.system.namespace.find({name:'billingtestdb.latest'});