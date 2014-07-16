// Hated the old tests. TODO
var test = require('tape')
,   Api = require('../index')
,   config = require('../lib/config')
,   utils = require('../lib/utils')
,   nock = require('nock')
,   format = require('util').format


test("Throw an error if key is not supplied.", function(t){
    t.plan(1)
    t.throws(function(){
        new Api()
    }, config.ERRORS.KEY_MISSING)
})

test("Creates the proper methods on initialization.", function(t){
    var withoutList = ['movie', 'top_rated', 'popular', 'upcoming', 'now_playing', 'latest']
    var api = new Api("key")
    ,   movieKeys = utils.without(withoutList, Object.keys(config.endpoints.movie))
    ,   movieMethods = movieKeys.map(methodPrefixer.bind(null,'movie'))
    ,   collectionKeys = utils.without('collection', Object.keys(config.endpoints.collection))
    ,   collectionMethods = collectionKeys.map(methodPrefixer.bind(null,'collection'))
    ,   companyKeys = utils.without('company', Object.keys(config.endpoints.company))
    ,   companyMethods = companyKeys.map(methodPrefixer.bind(null,'company'))

    

    movieMethods.forEach(function(val){
        t.equal(typeof api[val], 'function', "Testing movie method : " + val)
    })
    collectionMethods.forEach(function(val){
        t.equal(typeof api[val], 'function', "Testing collection method : " + val)
    })
    companyMethods.forEach(function(val){
        t.equal(typeof api[val], 'function', "Testing company method : " + val)
    })

    nock(config.host)
        .get(config.apiVer + format(config.endpoints.movie.images, 550) +'?api_key=key')
        .reply(200, {images : true})
    api.movieImages(550, function(err,data,res,opts){
        t.ok(data.images, 'Getting images')
        t.end()
    })
})



test("Calls the genre endpoints / plain generic", function(t){
    t.plan(3)
    var api = new Api('key')

    nock(config.host)
        .get('/3/genre/movie/list?api_key=key')
        .reply(200, {works : 'yes'})
    api.genres(function(err,data,res,opts){
        t.equal(data.works,'yes', 'Getting Genre List')
    })

    nock(config.host)
        .get('/3/genre/28/movies?api_key=key')
        .reply(200, {genre : 'action'})
    api.genresMovies(28, function(err,data,opts,dd,res){
        t.equal(data.genre, 'action', 'Getting movies of that genre')
    })

    nock(config.host)
        .get('/3/genre/28/movies?page=2&api_key=key')
        .reply(200, {genre : 'action'})
    api.genresMovies(28, {page : 2}, function(err,data,opts,dd,res){
        t.equal(data.genre, 'action', 'Getting page 2 movies of that genre')
    })
})

test("Calls the changes endpoints / test typed generic", function(t){
    t.plan(3)
    var api = new Api("key")
    nock(config.host)
        .get('/3/movie/changes?api_key=key')
        .reply(200, {changed : true})
    api.changes(function(err,data,opts,dd,res){
        t.ok(data.changed, 'Endpoint : Changes with default param')
    })

    nock(config.host)
        .get('/3/tv/changes?api_key=key')
        .reply(200, {changed : true})
    api.changes('tv', function(err,data,opts,dd,res){
        t.ok(data.changed, 'Endpoint : Changes with tv type')
    })

    nock(config.host)
        .get('/3/tv/changes?page=2&api_key=key')
        .reply(200, {changed : true})
    api.changes('tv', {page : 2}, function(err,data,opts,dd,res){
        t.ok(data.changed, 'Endpoint : Changes with options')
    })
})

test("Movie chain / chain generic", function(t){
    t.plan(2)
    var api = new Api("key")
    nock(config.host)
        .get('/3/movie/550?api_key=key')
        .reply(200, {changed : true})
    api.movie(550,function(err,data,opts,dd,res){
        t.ok(data.changed, 'Endpoint : Chain with id and callback first')
    })

    nock(config.host)
        .get('/3/movie/550?append_to_response=images&api_key=key')
        .reply(200, {changed : true})
    api.movie(550).images(function(err,data,opts,dd,res){
        t.ok(data.changed, 'Chained method with callback')
    })
})

test("Token generic all types", function(t){
    t.plan(4)
    var api = new Api("key")
    nock(config.host)
        .get('/3/tv/550/season/551?api_key=key')
        .reply(200, {tokens : true})
    api.season(550,551,function(err,data,opts,dd,res){
        t.ok(data.tokens, '2 Token Chained method')
    })

    nock(config.host)
        .get('/3/tv/550/season/551?append_to_response=images&api_key=key')
        .reply(200, {tokens : true})
    api.season(550,551).images(function(err,data,opts,dd,res){
        t.ok(data.tokens, '2 Token Chained method, chained call')
    })

    nock(config.host)
        .get('/3/tv/550/season/551/episode/552?api_key=key')
        .reply(200, {tokens : true})
    api.episode(550,551,552, function(err,data,opts,dd,res){
        t.ok(data.tokens, '3 Token Chained method')
    })

    nock(config.host)
        .get('/3/tv/550/season/551/episode/552?append_to_response=images&api_key=key')
        .reply(200, {tokens : true})
    api.episode(550,551,552).images(function(err,data,opts,dd,res){
        t.ok(data.tokens, '3 Token Chained method, chained call')
    })
})

test("Plain methods / singular methods", function(t){
    t.plan(2)
    var api = new Api("key")
    nock(config.host)
        .get('/3/tv/550/season/551/episode/552/external_ids?api_key=key')
        .reply(200, {tokens : true})
    api.episodeExternalIds(550,551,552,function(err,data,opts,dd,res){
        t.ok(data.tokens, 'Plain method multi token')
    })

    nock(config.host)
        .get('/3/tv/550/images?api_key=key')
        .reply(200, {tokens : true})
    api.tvImages(550,function(err,data,opts,dd,res){
        t.ok(data.tokens, 'Plain method single token')
    })
})

function methodPrefixer(prefix, val){
    return prefix + utils.normalize(val)
}