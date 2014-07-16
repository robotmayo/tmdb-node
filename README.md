[![Build Status](https://travis-ci.org/robotmayo/tmdb-node.svg?branch=master)](https://travis-ci.org/robotmayo/tmdb-node)


TMDB-Node
=========

A simple node wrapper for The Movie Database Api.

Note : Currently does not support authed endpoints(coming soon™)


`npm install tmdb-node`


    var TmdbApi = require('tmdb-api')
    var api = new TmdbApi(API_KEY) //Will throw an error if a key isn't supplied
    api.genres(function(err,data){
        console.log(data)
    })

Unless other wise noted all callbacks use the following signature :

callback(err,response)

Response will automatically be parsed as JSON unless there is an error.

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

I don't want a chained response, I just want movie images.

No problem! All chained methods have a static counterpart. The format is always the same, xY. Where x is the type and Y is the resource. Example:

    api.movieImages(550,myOpts,callback)

The signature for a method depends on the endpoint. If the endpoint has variables then each variable must be passed in order. Examples:

/discover/movie

function(opts,callback)

/tv/{id}/season/{season_number}

function(id,seasonNumber,opts,callback)

Search
======
Search works a bit differently from every other method.

    Api.search(where,query,opts,callback)

where-> The section to search. See [the official documentation for a list](http://docs.themoviedb.apiary.io/)

query-> Your search query


MIT LICENSE