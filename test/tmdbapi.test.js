// Hated the old tests. TODO
var test = require('tape')
,   Api = require('../index')
,   config = require('../lib/config')
,   utils = require('../lib/utils')


test("Throw an error if key is not supplied.", function(t){
    t.plan(1)
    t.throws(function(){
        new Api()
    }, config.ERRORS.KEY_MISSING)
})

test("Creates the proper methods on initialization.", function(t){
    var api = new Api("key")
    ,   movieKeys = utils.without('movie', Object.keys(config.endpoints.movie))
    ,   movieMethods = movieKeys.map(methodPrefixer.bind(null,'movie'))
    ,   collectionKeys = utils.without('collection', Object.keys(config.endpoints.collection))
    ,   collectionMethods = collectionKeys.map(methodPrefixer.bind(null,'collection'))

    movieMethods.forEach(function(val){
        t.equal(typeof api[val], 'function')
    })
    collectionMethods.forEach(function(val){
        t.equal(typeof api[val], 'function')
    })
    t.end()
})

function methodPrefixer(prefix, val){
    return prefix + utils.normalize(val)
}