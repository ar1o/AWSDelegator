var allowedOrigins = [
    'http(s|):\/\/localhost:3000',
    'http(s|):\/\/localhost:4000'
];
var regex = new RegExp('^(' + allowedOrigins.join('|') + ')', 'i');
module.exports = function(req, res, next) {
    if(regex.test(req.header('Referer'))) {
        var fragments = req.header('Referer').split('/');
        var base = fragments[0]+'//'+fragments[2];
        res.header("Access-Control-Allow-Origin", base);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
  next();
};