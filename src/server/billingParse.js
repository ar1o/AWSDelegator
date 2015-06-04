var fs=require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var databaseUrl = 'mongodb://localhost:27017/awsdb'; // "username:password@example.com/mydb"
var collections = ["bills"];

exports.parseBillingCSV = function () {
    MongoClient.connect(databaseUrl, collections, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to ', databaseUrl);    

        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(databaseUrl, function(err, db) {
            if(err) throw err;   
            db.collections(function(err, collections){
                var re = /latest/g;
                var flag = 0;
                for(var i in collections){
                    if(re.exec(collections[i]['namespace'])){
                        flag = 1;
                    }
                }   
                if(flag==0) db.collection('latest').save({time:"2010:01:01 00:00:00"});

                db.collection('latest').findOne(function(err,latest){
                    fs.readFile(process.cwd()+'/data/latestBills.csv',"utf8",function(error,text){
                        if(error) throw error;
                        var lines=text.split("\n");
                        lines.pop();
                        var header = lines[0].split(',');                                                       
                        var properties = ['ProductName','UsageQuantity','Cost','ResourceId','UsageStartDate','user:Volume Id'];
                        var numeric = ['UsageQuantity','Cost'];
                        var numeric_index = [];
                        var index = [];
                        for(var i=0;i<header.length;++i)header[i] = header[i].replace(/"/g,"");                                                                            
                        for(var i=0;i<properties.length;++i)index.push(header.indexOf(properties[i]));
                        for(var i=0;i<numeric.length;++i)numeric_index.push(properties.indexOf(numeric[i]));                        
                        for(var i=1;i<lines.length;++i){
                            bill=lines[i].split(",");                                    
                            if(bill[index[properties.indexOf('UsageQuantity')]]!=""){                                         
                                if(bill[index[properties.indexOf('UsageStartDate')]].replace(/"/g,"") > latest.time){
                                    var tuple = {};
                                    tuple[properties[0]]=bill[index[0]].replace(/"/g,"");
                                    for(var j=1;j<properties.length;++j){
                                        if(bill[index[j]]===""){
                                            tuple[properties[j]]="";
                                        }else{  
                                            var flag=0;                                          
                                            for(var k=0;k<numeric.length;++k){
                                                if(j===numeric_index[k]){
                                                    tuple[properties[j]]=parseFloat(bill[index[j]].replace(/"/g,""));  
                                                    flag=1;                                                    
                                                }
                                            }
                                            if(flag==0)
                                                tuple[properties[j]]=bill[index[j]].replace(/"/g,"");
                                        }                                    
                                    }
                                    db.collection(currentCollection).insert(tuple);                                
                                    db.collection('latest').update({_id:latest._id},{time:bill[index[properties.indexOf('UsageStartDate')]].replace(/"/g,"")});
                                }
                            }                            
                        }
                    });
                });
            }); 
        });        
    }});
};
