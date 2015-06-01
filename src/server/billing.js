// Mongoose import
var mongoose = require('mongoose');
// Mongo import
var mongo = require('mongodb');

//need to pass db from server to these functions???

//Parameterize time for function
exports.getBillingByHour = function (time, req, res) {

    // var product = req.query.productName;
    // var time = req.query.startTime;
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
        console.log(d);
        // res.send(d);
    });
};

//parameterize to query for a specific month??
exports.getBillingMonthToDate = function(req, res) {
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
        console.log(d)
        // res.send(d);
    });


};

module.exports = {
    getBillingByHour : getBillingByHour,
    getBillingMonthToDate : getBillingMonthToDate
}
