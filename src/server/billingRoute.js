
exports.billingByHour = function (req, res){
	    mongoose.model('Billings').aggregate([{
        $match: {
            cost: {
                $gte: 0
            },
            // productName: {
            //     $eq: "Amazon Elastic Compute Cloud"
            // },
            startTime: {
                $eq: "2015-06-19 19:00:00"
            }
        }
    }, {
        $group: {
            _id: "$productName",
            total: {
                $sum: "$cost"
            }
        }
    }]).exec(function(e, d) {
        // console.log(d);
        res.send(d);
    });
};
 
exports.billingMonthToDate = function (req, res){
    mongoose.model('Billings').aggregate([{
        $match: {
            cost: {
                $gte: 0
            }
        }
    }, {
        $group: {
            _id: "$productName",
            total: {
                $sum: "$cost"
            }
        }
    }]).exec(function(e, d) {
        // console.log(d)
        res.send(d);
    });
}

 
