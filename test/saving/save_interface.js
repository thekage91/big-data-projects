/**
 * Created by ugo on 14/11/15.
 */
'use strict';

var request = require('supertest'),
    express = require('express'),
    util = require('../util.js'),
    q = require('q'),
    should = require('should-promised');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var mongoose = app.mongoose;
var save_interface = require('../../models/save_interface.js'),
    Movie0 = mongoose.model('Movie0');


describe('Save interface', function () {

    describe('Version 0', function () {
        afterEach('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function (err, ww) {
                done();
            })
        });


        it('saves one movie', function (done) {
            var movie_to_save = util.fakeMovie();

            var movie_saved = save_interface.save(0, {movie: movie_to_save});

            movie_saved.then(() => {
                Movie0.find({title: movie_to_save.title}, function (err, movie) {
                    movie.should.not.be.null();
                    movie.length.should.be.equal(1);
                    done();
                })
            });

        })

        it('saves two movies', function (done) {
            done();
        })
    })
});

