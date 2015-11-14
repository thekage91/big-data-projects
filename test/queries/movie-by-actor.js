/**
 * Created by ugo on 12/11/15.
 */

var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var mongoose = app.mongoose;
var queries = require('../../models/query_interface.js');

var _id = '';

describe('Version 0', function(){
    describe('Retrieve movies acted by an actor', function(){
        beforeEach('Populate database',function() {
            mongoose.model('Movie0')
            // runs before each test in this block
        });

        it('retrieves one movie', function(done){
            queries.all_films_one_actor()
        })
    });
});
