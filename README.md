[![Build Status](https://travis-ci.org/robotmayo/tmdb-node.svg?branch=master)](https://travis-ci.org/robotmayo/tmdb-node)


TMDB-Node
=========

A simple node wrapper for The Movie Database Api.


    npm install



    var TmdbApi = require('tmdb-api')
    var api = new TmdbApi(API_KEY) //Will throw an error if a key isn't supplied
    api.genres(function(err,data){
        console.log(data)
    })

Some of the calls are chainable, the chainable methods work similar to the non chainable ones.
The biggest difference is that chainable methods will not execute until you pass in a callback
or call the exec method.


    var TmdbApi = require('tmdb-api')
    var api = new TmdbApi(API_KEY) //Will throw an error if a key isn't supplied
    api.movies(550).images().credits().exec(function(err,data){
        console.log(data)
    })
    api.collection(550).images(function(err,data){
        console.log(data)
    })