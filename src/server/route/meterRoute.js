exports.rate = function(req,res) {
	mongoose.model('latest').find().exec(function(e,d) {
		if(e) throw e;
		var latestDate = new Date(d[0].time);
        var lastHour = latestDate.getTime();
        var lastHourTime = new Date(lastHour);
        var lastHourDate = lastHourTime.getFullYear()+'-'+checkDate((lastHourTime.getMonth()+1))+'-'+
                checkDate(lastHourTime.getDate())+' '+checkDate(lastHourTime.getHours())+':'+
                checkDate(lastHourTime.getMinutes())+':'+checkDate(lastHourTime.getSeconds());
		mongoose.model('Billings').aggregate([{
            $match: {
                UsageStartDate: {
                    $eq: lastHourDate
                }
            }
        }, {
            $project: {
                _id: 1,
                UsageStartDate: 1,
                Cost: 1,
                NonFreeCost: 1
            }
        }, {
            $group: {
                _id: "$UsageStartDate",
                total: {
                    $sum: "$Cost"
                },
                TNonFreeCost: {
                    $sum: "$NonFreeCost"
                }
            }        
        }, {
            $project: {
                _id: 1,
                total: {
                    $add: ['$TNonFreeCost', '$total']
                }
            }
        }]).exec(function(e, d) {
        	res.send(d);
        });
	});
}

exports.usage = function(req,res) {
    mongoose.model('latest').find().exec(function(e,d1) {
        if(e) throw e;
        var latestDate = new Date(d1[0].time);
        var lastHour = latestDate.getTime();
        var lastHourTime = new Date(lastHour);
        var endDate = lastHourTime.getFullYear()+'-'+checkDate((lastHourTime.getMonth()+1))+'-'+
                checkDate(lastHourTime.getDate())+' '+checkDate(lastHourTime.getHours())+':'+
                checkDate(lastHourTime.getMinutes())+':'+checkDate(lastHourTime.getSeconds());
        mongoose.model('usageMeter').find().exec(function(e,d2) {
            if(e) throw e;
            var resetDate = new Date(d2[0].time);
            var resetHour = resetDate.getTime();
            var resetHourTime = new Date(resetHour);
            var startDate = resetHourTime.getFullYear()+'-'+checkDate((resetHourTime.getMonth()+1))+'-'+
                    checkDate(resetHourTime.getDate())+' '+checkDate(resetHourTime.getHours())+':'+
                    checkDate(resetHourTime.getMinutes())+':'+checkDate(resetHourTime.getSeconds());
            mongoose.model('Billings').aggregate([{
                $match: {
                    $and: [
                        {
                            UsageStartDate: {$gt: startDate}
                        },{
                            UsageStartDate: {$lte: endDate}
                        }
                    ]
                }
            }, {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$Cost"
                    }
                }
            }]).exec(function(e, d3) {
                res.send({time:endDate,total:d3[0].total});
            });
        });
    });
}

exports.balance = function(req,res) {
	res.send();
}

var checkDate = function(val){
    val = String(val);
    if(val<10) val = '0'+val;
    return val;
}