Function.prototype.bind = function(scope) {
    var fn = this;
    return function() {
        return fn.apply(scope, arguments);
    }
};

Object.defineProperty(Array.prototype, 'random', {
    get: function(){ return this[Math.floor(Math.random()*this.length)]; }
});

Backbone.Model.prototype.change = function(prop, cb) {
    var self = this;
    if(!this.hasOwnProperty(prop)) {
        Object.defineProperty(this, prop, {
            set: function(val) { return self.set(prop, val); },
            get: function() { return self.get(prop); }
        });
    }
    if(cb) {
        return this.on('change:'+prop, cb);
    }
}





