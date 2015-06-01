var express = require('express');
 
var billing = new express.Router();

var metrics = require('./billing')


billing.get('/', function(req, res, next) {
	console.log("CHECKIDY");
    res.send(metrics.getBillingByHour(req, res));
});
 

module.exports = billing; 
