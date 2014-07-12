var xtend = require('xtend')
,   utils = require('./utils')
,   each = utils.each

function Chain(api,uri,methods,opts,cb){
    this._chain = []
    this._remaining = {}
    this.api = api
    this.opts = {
        uri : uri,
        qs : {}
    }
    
    methods.forEach(function(v){
        this._remaining[v] = true
        this[v] = this.add.bind(this, v)
    }, this)
    var args = Array.prototype.slice.call(arguments)
    if(typeof opts == 'function'){
        cb = opts
        opts = {}
    }
    if(cb){
        return this.exec(opts,cb)
    }
}

Chain.prototype.add = function(method,opts,cb) {
    if(this._remaining[method] === true){
        this._remaining[method] = false
        this._chain.push(method)
    }
    var args = Array.prototype.slice.call(arguments)
    if(typeof opts == 'function'){
        return this.exec(opts)
    }
    if(typeof cb == 'function'){
        return this.exec(opts,cb)
    }
    return this;
}

Chain.prototype.exec = function(opts,cb) {
    if(typeof opts == 'function') {
        cb = opts
        opts = {}
    }
    this.opts.qs = xtend(this.opts.qs,opts)
    if(this._chain.length > 0){
        this.opts.qs.append_to_response = this._chain.reduce(function(pre,cur,ind){
            return pre + ','+cur
        })
    }
    this.api._execRequest(this.opts,cb)
    this.cleanUp()
    return this
}

Chain.prototype.cleanUp = function() {
    this.opts = {
        uri : this.opts.uri,
        qs : {}
    }
    each(this._remaining, function(v,k){
        this[k] = true
    })
}

module.exports = Chain;