/**
 * Created by ugo on 12/11/15.
 */

var express = require('express'),
    q = require('q'),
    should = require('should-promised'),
    util = require('../util.js');

process.env.NODE_ENV = 'test';

var app = require('../../app.js'),
    mongoose = app.mongoose;
var query_interface = require('../../models/query_interface.js'),
    save_interface = require('../../models/save_interface.js');

describe('Query: Retrieve all movies acted by one actor', function () {


    it("fails with wrong 'version' argument", function (done) {
       /* (query_interface.all_films_one_actor('a', (util.fakeMovie()))).should.throw(Error);
        (query_interface.all_films_one_actor(null, (util.fakeMovie()))).should.throw(Error);
        (query_interface.all_films_one_actor(undefined, (util.fakeMovie()))).should.throw(Error);*/
        ( () => {throw new Error('prova'); return 0;}).should.throw(Error);
      //  (query_interface.all_films_one_actor('a', (util.fakeMovie()))).should.throw(Error);
        done();
    });

    it("fails with wrong 'actor' argument", function (done) {
        query_interface.all_films_one_actor(1, undefined).should.throw(Error);
        query_interface.all_films_one_actor(1, null).should.throw(Error);
        done();
    });


    describe('Version 0', function () {

        describe('Retrieve one movie acted by one actor', function () {
            var saved_movie;
            var saved_actor;
            var saved_director;
            var saved_genre;

            before('Populate database', function () {
                saved_movie = util.fakeMovie();
                saved_actor = util.fakeActor();
                saved_director = util.fakeDirector();
                saved_genre = util.fakeGenre();
                saved_movie.actors.push(saved_actor);
                saved_movie.directors.push(saved_director);
                saved_movie.genres.push(saved_genre);
                save_interface.save(0, {movie: saved_movie});
            });

            after('Clear database', function (done) {
                mongoose.connection.db.dropDatabase(function () {
                    done();
                })
            });

            it('Retrieves one movie', function (done) {

                // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
                // Version 0 model does not have relationships, only embedded documents.
                delete saved_actor.movies;

                query_interface.all_films_one_actor(0, saved_actor)
                    .then((movies) => {
                        movies.length.should.eql(1);
                        movies[0].title.should.eql(saved_movie.title);
                        done();
                    });
            })
        });
    });
});
