var config = require('./config')
,   request = require('request')
,   ERRORS = config.ERRORS
,   format = require('util').format
,   xtend = require('xtend')
,   utils = require('./utils')
,   without = utils.without
,   each = utils.each
,   normalize = utils.normalize
,   countTokens = utils.countTokens
,   Chain = require('./chain')

function TmdbApi(key){
    if(!key) throw new Error(ERRORS.KEY_MISSING)
    this.apiKey = key
    //TODO: Make this less terrible
    createTokenedMethods(this, without('movie',Object.keys(config.endpoints.movie)).map(function(val){
        return {name : val, methodName : 'movie'+normalize(val), uri : config.endpoints.movie[val] }
    }))
    createTokenedMethods(this, without('collection',Object.keys(config.endpoints.collection)).map(function(val){
        return {name : val, methodName : 'collection'+normalize(val), uri : config.endpoints.collection[val] }
    }))
    createTokenedMethods(this, without('company',Object.keys(config.endpoints.company)).map(function(val){
        return {name : val, methodName : 'company'+normalize(val), uri : config.endpoints.company[val] }
    }))
    createTypedMethods(this
        ,   {
                name : config.endpoints.changes.changes,
                methodName : 'changes',
                uri : config.endpoints.changes.changes,
                defaultType : 'movie'
            }
        ,   'movie')
    this.movie = genericChain.bind(this
        ,   config.endpoints.movie.movie
        ,   without(['movie', 'top_rated', 'popular', 'upcoming', 'now_playing', 'latest'], Object.keys(config.endpoints.movie)))
}

/**
    Genres
    Returns the list of movie genres.
    @sig Genres(function(err,data,response))
    @sig Genres([Integer] Id,function(err,data,response))
    @sig Genres([Integer] Id, [Object] Options, function(err,data,response)) 
    @Desc Fetch all movies with the specified genre.(Note this acheives the same effect as Genres(Integer))
*/
TmdbApi.prototype.genres = function(id,opts,callback) {
    var args = Array.prototype.slice.call(arguments)
    if(args.length === 1){
        callback = id
        id = null
    }else if(args.length === 2){
        callback = opts
        opts = {}
    }

    if(null == id){
        return this._execRequest({
            uri : config.host + config.apiVer + config.endpoints.genres.genreList
        }, callback)
    }
    this._execRequest({
        uri : config.host + config.apiVer + format(config.endpoints.genres.movies, id),
        qs : opts
    }, callback)
}

/**
    Collection
    @Desc Chainable. Get the collection the specific collection id belongs to.
    @sig collection([Integer] id, [Object] opts, function(err,data,response))
*/
TmdbApi.prototype.collection = function(id,opts,callback) {
    return new Chain(this
        , this.formUri(format(config.endpoints.collection.collection, id))
        , without('collection', Object.keys(config.endpoints.collection))
        , opts
        , callback)
}

/**
    Company
    @Desc Chainable. Get company info
    @sig collection([Integer] id, [Object] opts, function(err,data,response))
*/
TmdbApi.prototype.company = function(id,opts,callback) {
    return new Chain(this
        ,this.formUri(format(config.endpoints.company.company,id))
        ,without('company', Object.keys(config.endpoints.company))
        ,opts
        ,callback)
}

function createTokenedMethods(api, methodList) {
    methodList.forEach(function(val){
        switch(countTokens(val.uri)){
            case 0:
            case 1:
            default:
                return this[val.methodName] = function(token,opts,callback){
                    if(opts) return genericToken(this,val.uri,token,opts)
                    return genericToken(this,val.uri,token,opts,callback)
                }
            case 2:
                return this[val.methodName] = function(token,tokenB,opts,callback){
                    if(opts) return genericToken(this,val.uri,token,tokenB,opts)
                    return genericToken(this,val.uri,token,tokenB,opts,callback)
                }
            case 3:
                return this[val.methodName] = function(token,tokenB,tokenC,opts,callback){
                    if(opts) return genericToken(this,val.uri,token,tokenB,tokenC,opts)
                    return genericToken(this,val.uri,token,tokenB,tokenC,opts,callback)
                }
        }
    },api)
}

function createTypedMethods(api,methodList,defaultType){
    if(!Array.isArray(methodList)) methodList = [methodList]
    methodList.forEach(function(val){
        this[val.methodName] = function(type,opts,callback){
            if(arguments.length === 1) return genericTyped(this,val.uri,val.defaultType,type)
            if(arguments.length === 2) return genericTyped(this,val.uri,val.defaultType,type, opts)
            return genericTyped(this, val.uri, val.defaultType, type, opts, callback)
        }
    }, api)
}

function genericChain(uri,methodList,id,opts,callback){
    return new Chain(this
        ,   this.formUri(format(uri,id))
        ,   methodList
        ,   opts
        ,   callback)
}

function genericTyped(api, uri,defaultType,type,opts,callback) {
    var args = Array.prototype.slice.call(arguments)
    if(typeof type === 'function'){
        callback = type
        type = defaultType
        opts = {}
    }else if(typeof opts === 'function'){
        callback = opts
        opts = {}
    }else if(typeof type === 'object'){
        callback = opts
        opts = type
        type = defaultType
    }
    return api._execRequest({
        uri : config.host + config.apiVer + format(uri, type),
        qs : opts
    }, callback)
}

function genericToken(api,uri) {
    var args = Array.prototype.slice.call(arguments,2)
    ,   callback = args.pop()
    ,   opts = args.pop()
    ,   tokens = args.slice(0)
    if(typeof opts !== 'object'){
        tokens.push(opts)
        opts = {}
    }
    if(isNaN(tokens[0])) {
        if(!callback){
            for(var i = 0, l =args.length; i < l; i++){
                if(typeof args[i] === 'function') return args[i](config.ERRORS.NO_TOKEN)
            }
        }
        return callback(config.ERRORS.NO_TOKEN)
    }
    var uri = api.formUri(format.apply(null,[uri].concat(tokens)))
        api._execRequest({
            uri : uri,
            qs : opts
        }, callback)
}



TmdbApi.prototype.formUri = function(uri) {
    return config.host + config.apiVer + uri
}

TmdbApi.prototype._execRequest = function(opts,callback) {
    if(null == opts.qs) opts.qs = {}
    if(null == opts.method) opts.method = 'GET'
    opts.qs.api_key = this.apiKey
    request(opts,function(err,body,response){
        if(err) return callback(err,response, body, opts, this)
        return callback(err,JSON.parse(response),body, opts, this)
    })
}




module.exports = TmdbApi
