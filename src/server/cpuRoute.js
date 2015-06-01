var express = require('express');
 
var cpu = new express.Router();

var metrics = require('./instanceMetrics')


cpu.get('/', function(req, res, next) {
	console.log("CHECKIDY");
    res.send(metrics.getCPU(req, res));
});
 

module.exports = cpu;