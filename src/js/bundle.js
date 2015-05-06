(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// var allowedOrigins = [
//     'http(s|):\/\/localhost:3000',
//     'http(s|):\/\/localhost:4000'
// ];
// var regex = new RegExp('^(' + allowedOrigins.join('|') + ')', 'i');
// module.exports = function(req, res, next) {
//     if(regex.test(req.header('Referer'))) {
//         var fragments = req.header('Referer').split('/');
//         var base = fragments[0]+'//'+fragments[2];
//         res.header("Access-Control-Allow-Origin", base);
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     }
//   next();
// };

},{}]},{},[1]);
