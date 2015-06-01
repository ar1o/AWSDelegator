var express = require('express');
 
var instances = new express.Router();

var metrics = require('./instanceMetrics')


instances.get('/', function(req, res, next) {
    res.send(metrics.getEC2Instances());
});
 

module.exports = instances;