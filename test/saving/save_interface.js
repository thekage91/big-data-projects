/**
 * Created by ugo on 14/11/15.
 */
'use strict';

var request = require('supertest'),
    express = require('express'),
    util = require('../util.js'),
    q = require('q');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var mongoose = app.mongoose;
var save_interface = require('../../models/save_interface.js');


describe('Save interface', function(){

        afterEach('Clear database', function(done) {
        mongoose.connection.db.dropDatabase(function(){
            done()
        })
        });


        it('saves one movie', function(done){
            let movie = util.fakeMovie();
            console.log(movie);
            (save_interface.save(0,{movie: movie})).then((data) => {
                console.log(data); done()},(err) => {console.error(err); done()});
        })

});
