/**
 * Created by ugo on 12/11/15.
 */

var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var mongoose = app.mongoose;
var query_interface = require('../../models/query_interface.js');
var save_interface = require('../../models/save_interface.js');
var util = require('../util.js');

var _id = '';

describe('Version 0', function(){
    describe('Retrieve one movie acted by one actor', function(){
        beforeEach('Populate database',function() {

            save_interface.save(0,{movie: util.fakeMovie())};
        });

        it('retrieves one movie', function(done){
            queries.all_films_one_actor();
        })
    });
});
