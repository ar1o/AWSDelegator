exports.operations = function(req, res){
    var product = req.query.productName;
    var iOps = {},iOpPercent = {};
    mongoose.model('Billings').find({ProductName: product}).exec(function(e,d){
        var op;
        for(var i=0 in d){
            op = d[i].toJSON().Operation;
            if(!(op in iOps)){
                iOps[op] = 1;
            }else{
                iOps[op] +=1;
            }
        }
        var iTotal=0,iCount=0;
        for(var i in iOps){
            iTotal+=iOps[i];
        }
        for(var i=0 in iOps){
            iOpPercent[i]=(iOps[i]/iTotal);
        }
        res.send(iOpPercent);
    });
}