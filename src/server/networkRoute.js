 
var express = require('express');
 
var networkin = new express.Router();

var networking = require('./instanceMetrics')


networking.get('/in', function(req, res, next) {
	console.log("CHECKIDY");
    res.send(metrics.getCPU(req, res));
});
networking.get('/out', function(req, res, next) {
	console.log("CHECKIDY");
    res.send(metrics.getCPU(req, res));
});

module.exports = networking;