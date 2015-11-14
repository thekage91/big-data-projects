/**
 * Created by ugo on 14/11/15.
 */


/**
 * Created by ugo on 12/11/15.
 */

var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var mongoose = app.mongoose;
var queries = require('../../models/save_interface.js');


describe('Save interface', function(){
    describe('single movie', function(){
        it('saves one movie', function(){
            let movie = {
                title : 'test_movie'


            }
            queries.all_films_one_actor()
        })
    });
});
