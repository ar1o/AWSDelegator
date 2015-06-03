//var mongodb = require('mongodb');
//var MongoClient = mongodb.MongoClient;
var dburl = 'mongodb://localhost:27017/billingtestdb';

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(dburl, function(err, db) {
  if(err) throw err;   
  db.collections(function(err, collections){
 	var re = /latest/g;
 	for(var i in collections){
 		if(re.exec(collections[i]['namespace'])){
 			console.log('true');
 		}
 	}   
  }); 
});