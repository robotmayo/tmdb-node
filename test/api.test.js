var expect = require('chai').expect
,   Api = require('../')
,   config = require('../lib/config')
describe("TMDB Api Wrapper", function(){
    it("Should throw an error if a key isn't supplied", function(){
        expect(function(){
            new Api()
        }).to.throw(config.ERRORS.KEY_MISSING)
    })
})