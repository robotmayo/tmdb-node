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
    // Movie Methods
    var movieWithoutList = ['movie', 'top_rated', 'popular', 'upcoming', 'now_playing', 'latest']

    createTokenedMethods(this, without(movieWithoutList,Object.keys(config.endpoints.movie)).map(function(val){
        return { methodName : 'movie'+normalize(val), uri : config.endpoints.movie[val] }
    }))
    createGenericChainMethod(this, config.endpoints.movie.movie, 'movie', without(movieWithoutList,Object.keys(config.endpoints.movie)))
    createPlainMethods(this,movieWithoutList.slice(1).map(function(val){
        return {methodName : "movie"+normalize(val), uri : config.endpoints.movie[val]}
    }))

    // Collection, company, changes, genres

    createTokenedMethods(this, without('collection',Object.keys(config.endpoints.collection)).map(function(val){
        return { methodName : 'collection'+normalize(val), uri : config.endpoints.collection[val] }
    }))
    createGenericChainMethod(this, config.endpoints.collection.collection, 'collection', without('collection',Object.keys(config.endpoints.collection)))

    createTokenedMethods(this, without('company',Object.keys(config.endpoints.company)).map(function(val){
        return { methodName : 'company'+normalize(val), uri : config.endpoints.company[val] }
    }))
    createTypedMethods(this
        ,   {
                name : config.endpoints.changes.changes,
                methodName : 'changes',
                uri : config.endpoints.changes.changes,
                defaultType : 'movie'
            }
        ,   'movie')
    createPlainMethods(this, [{methodName : "genres", uri : config.endpoints.genres.movieList}])
    createTokenedMethods(this, [{methodName : "genresMovies", uri : config.endpoints.genres.movies}])

    // Certification, credit, discover, find, job, keyword
    createTypedMethods(this,
        {
            name : config.endpoints.changes.changes,
            methodName : 'certification',
            uri : config.endpoints.certification.certification,
            defaultType : 'movie'
        },
        'movie')
    createTokenedMethods(this, [{methodName : "credit", uri : config.endpoints.credit.credit}])
    createTokenedMethods(this, [{methodName : "discover", uri : config.endpoints.discover.discover}])
    createTokenedMethods(this, [{methodName : "find", uri : config.endpoints.find.find}])
    createPlainMethods(this, [{methodName : "job", uri : config.endpoints.job.job}])
    createTokenedMethods(this, 
        [{methodName : "keyword", uri : config.endpoints.keyword.keyword},
        {methodName : "keywordMovies", uri : config.endpoints.keyword.movies}])

    // List, netowrk
    createTokenedMethods(this, 
        [{methodName : "list", uri : config.endpoints.list.list},
        {methodName : "listItemStatus", uri : config.endpoints.list.item_status}])
    createTokenedMethods(this, [{methodName : "network", uri : config.endpoints.network.network}])

    // People, reviews, timezone
    var personWithoutList = ['person', 'popular','latest']

    createTokenedMethods(this, without(personWithoutList,Object.keys(config.endpoints.person)).map(function(val){
        return { methodName : 'person'+normalize(val), uri : config.endpoints.person[val] }
    }))
    createGenericChainMethod(this, config.endpoints.person.person, 'person',
     without(personWithoutList,Object.keys(config.endpoints.person).map(function(val){
        return val[0] + normalize(val).slice(1)
     })))
    createPlainMethods(this,personWithoutList.slice(1).map(function(val){
        return {methodName : "person"+normalize(val), uri : config.endpoints.person[val]}
    }))
    createTokenedMethods(this, [{methodName : "reviews", uri : config.endpoints.reviews.reviews}])
    createPlainMethods(this, [{methodName : "timezone", uri : config.endpoints.timezones.list}])

    // Tv
    var tvWithoutList = ['tv','on_the_air', 'top_rated', 'airing_today', 'popular']
    createTokenedMethods(this, without(tvWithoutList,Object.keys(config.endpoints.tv)).map(function(val){
        return { methodName : 'tv'+normalize(val), uri : config.endpoints.tv[val] }
    }))
    createGenericChainMethod(this, config.endpoints.tv.tv, 'tv',
     without(tvWithoutList,Object.keys(config.endpoints.tv).map(function(val){
        return val[0] + normalize(val).slice(1)
     })))
    createPlainMethods(this,tvWithoutList.slice(1).map(function(val){
        return {methodName : "tv"+normalize(val), uri : config.endpoints.tv[val]}
    }))

    // Seasons
    var seasonWithoutList = ['season','on_the_air', 'top_rated', 'airing_today', 'popular']
    createTokenedMethods(this, without(seasonWithoutList,Object.keys(config.endpoints.season)).map(function(val){
        return { methodName : 'season'+normalize(val), uri : config.endpoints.season[val] }
    }))
    createGenericChainMethod(this, config.endpoints.season.season, 'season',
     without(seasonWithoutList,Object.keys(config.endpoints.season).map(function(val){
        return val[0] + normalize(val).slice(1)
     })))
    createPlainMethods(this,seasonWithoutList.slice(1).map(function(val){
        return {methodName : "season"+normalize(val), uri : config.endpoints.season[val]}
    }))

    // Episodes
    var episodeWithoutList = ['episode']
    createTokenedMethods(this, without(episodeWithoutList,Object.keys(config.endpoints.episode)).map(function(val){
        return { methodName : 'episode'+normalize(val), uri : config.endpoints.episode[val] }
    }))
    createGenericChainMethod(this, config.endpoints.episode.episode, 'episode',
     without(episodeWithoutList,Object.keys(config.endpoints.episode).map(function(val){
        return val[0] + normalize(val).slice(1)
     })))

}

TmdbApi.prototype.search = function(where,query,opts,callback) {
    if(typeof opts === 'function'){
        callback = opts
        opts = { qs : {} }
    }
    if(!query || typeof query !== 'string') return callback("You must specify a query!")
    opts.uri = formUri(config.endpoints.search[where])
    opts.qs.query = query
    this._execRequest(opts,callback)
};

TmdbApi.prototype._execRequest = function(opts,callback) {
    if(null == opts.qs) opts.qs = {}
    if(null == opts.method) opts.method = 'GET'
    opts.qs.api_key = this.apiKey
    request(opts,function(err,body,response){
        if(err) return callback(err,response, body, opts, this)
        return callback(err,JSON.parse(response),body, opts, this)
    })
}

function createTokenedMethods(api, methodList) {
    methodList.forEach(function(val){
        switch(countTokens(val.uri)){
            case 0:
            case 1:
            default:
                return this[val.methodName] = function(token,opts,callback){
                    if(typeof opts === 'function') return genericToken(this,val.uri,token,opts)
                    return genericToken(this,val.uri,token,opts,callback)
                }
            case 2:
                return this[val.methodName] = function(token,tokenB,opts,callback){
                    if(typeof opts === 'function') return genericToken(this,val.uri,token,tokenB,opts)
                    return genericToken(this,val.uri,token,tokenB,opts,callback)
                }
            case 3:
                return this[val.methodName] = function(token,tokenB,tokenC,opts,callback){
                    if(typeof opts === 'function') return genericToken(this,val.uri,token,tokenB,tokenC,opts)
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

function createPlainMethods(api,methodList){
    if(!Array.isArray(methodList)) methodList = [methodList]
    methodList.forEach(function(val){
        this[val.methodName] = function(opts,callback){
            if(typeof opts === 'function'){
                callback = opts
                opts = {}
            }
            opts.uri = config.host + config.apiVer + val.uri
            return api._execRequest(opts,callback)
        }
    }, api)
}

function createGenericChainMethod(api, uri,firstNode, methodList){
    var numTokens = countTokens(uri)
    if(numTokens === 1){
        return api[firstNode] = function(id,opts,callback){
            if(!opts) {
                return new Chain(api,formUri(format(uri,id)), methodList)
            }else if(typeof opts === 'function'){
                callback = opts;
                opts = {}
            }
            return new Chain(api,formUri(format(uri,id)),methodList,opts,callback)
        }
    }else if(numTokens === 2){
        return api[firstNode] = function(tokenA,tokenB,opts,callback){
            if(!opts) {
                return new Chain(api,formUri(format(uri,tokenA,tokenB)), methodList)
            }else if(typeof opts === 'function'){
                callback = opts;
                opts = {}
            }
            return new Chain(api,formUri(format(uri,tokenA,tokenB)),methodList,opts,callback)
        }
    }else if(numTokens === 3){
        return api[firstNode] = function(tokenA,tokenB,tokenC,opts,callback){
            if(!opts) {
                return new Chain(api,formUri(format(uri,tokenA,tokenB, tokenC)), methodList)
            }else if(typeof opts === 'function'){
                callback = opts;
                opts = {}
            }
            return new Chain(api,formUri(format(uri,tokenA,tokenB, tokenC)),methodList,opts,callback)
        }
    }
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
    var uri = formUri(format.apply(null,[uri].concat(tokens)))
        api._execRequest({
            uri : uri,
            qs : opts
        }, callback)
}



function formUri(uri) {
    return config.host + config.apiVer + uri
}




module.exports = TmdbApi
