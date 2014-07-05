var config = require('./config')
,   request = require('request')
,   ERRORS = config.ERRORS

function TmdbApi(key){
    if(!key) throw new Error(ERRORS.KEY_MISSING)
    this.apiKey = key;
    this._chain = {};
}

module.exports = TmdbApi