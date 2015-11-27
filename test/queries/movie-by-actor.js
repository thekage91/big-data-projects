/**
 * Created by ugo on 12/11/15.
 */

'use strict';

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

        //(query_interface.all_films_one_actor('a', (util.fakeMovie()))).should.throw(Error);

        try {
            query_interface.all_films_one_actor('A', (util.fakeMovie()));
        }
        catch (err) {
            err.should.be.Error();
            done();
        }
    });

    it("fails with undefined 'actor' argument", function (done) {

        //query_interface.all_films_one_actor(1, null).should.throw(Error);

        try {
            query_interface.all_films_one_actor(1, undefined);
        }
        catch (err) {
            err.should.be.Error();
            done();
        }
    });


    describe('Version 0', function () {

        var saved_movie_with_1_actor;
        var saved_movie_with_10_actor;
        var saved_movie_with_100_actor;
        var saved_actor_with_1_movie;
        var saved_actor_with_10_movie;
        var saved_actor_with_100_movie;
        var saved_director;
        var saved_genre;

        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_actor = util.fakeMovie();
            saved_movie_with_10_actor = util.fakeMovie();
            saved_movie_with_100_actor = util.fakeMovie();
            saved_actor_with_1_movie = util.fakeActor();
            saved_actor_with_10_movie = util.fakeActor();
            saved_actor_with_100_movie = util.fakeActor();
            saved_director = util.fakeDirector();
            saved_genre = util.fakeGenre();


            all_saved.push(save_interface.save(0,
                {
                    movie: saved_movie_with_1_actor, actor: saved_actor_with_1_movie,
                    director: saved_director, genre: saved_genre
                }))


            all_saved.push(save_interface.save(0,
                {movie: saved_movie_with_10_actor}))


            all_saved.push(save_interface.save(0,
                {movie: saved_movie_with_100_actor}))

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 100; i++) {
                        if (i < 10)
                            all_saved.push(save_interface.save(0, {
                                movie: util.fakeMovie(),
                                actor: saved_actor_with_10_movie
                            }));
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(),
                            actor: saved_actor_with_100_movie
                        }));
                }
                q.all(all_saved).then(() => done())
            })


        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves 1 movie', function (done) {

            // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor_with_1_movie.movies;

            query_interface.all_films_one_actor(0, saved_actor_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_actor.title);
                done();
            })
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            delete saved_actor_with_10_movie.movies;

            query_interface.all_films_one_actor(0, saved_actor_with_10_movie, (err, movies) => {
                movies.length.should.eql(10);
                for (let i = 0; i < movies.length; i++)
                    movies[i].actors[0].first_name.should.be.eql(saved_actor_with_10_movie.first_name);
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            delete saved_actor_with_100_movie.movies;

            query_interface.all_films_one_actor(0, saved_actor_with_100_movie, (err, movies) => {
                movies.length.should.eql(100);
                for (let i = 0; i < movies.length; i++) {
                    movies[i].actors[1] = movies[i].actors[1] || {};
                    [movies[i].actors[0].first_name, movies[i].actors[1].first_name]
                        .should.containEql(saved_actor_with_100_movie.first_name);
                }
                done();
            });
        });

    });


    describe('Version 1', function () {

        var saved_movie_with_1_actor;
        var saved_movie_with_10_actor;
        var saved_movie_with_100_actor;
        var saved_actor_with_1_movie;
        var saved_actor_with_10_movie;
        var saved_actor_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_actor = util.fakeMovie();
            saved_movie_with_10_actor = util.fakeMovie();
            saved_movie_with_100_actor = util.fakeMovie();
            saved_actor_with_1_movie = util.fakeActor();
            saved_actor_with_10_movie = util.fakeActor();
            saved_actor_with_100_movie = util.fakeActor();


            all_saved.push(save_interface.save(1,
                {movie: saved_movie_with_1_actor, actor: saved_actor_with_1_movie}))

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 100; i++) {
                        if (i < 10)
                            all_saved.push(save_interface.save(1, {
                                movie: util.fakeMovie(),
                                actor: saved_actor_with_10_movie
                            }));
                        all_saved.push(save_interface.save(1, {
                            movie: util.fakeMovie(),
                            actor: saved_actor_with_100_movie
                        }));
                }
                q.all(all_saved).then(() => done())
            })
        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves 1 movie', function (done) {

            // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor_with_1_movie.movies;

            query_interface.all_films_one_actor(1, saved_actor_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_actor.title);
                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor_with_10_movie.movies;

            query_interface.all_films_one_actor(1, saved_actor_with_10_movie, (err, movies) => {
                movies.length.should.eql(10);
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_actor_with_100_movie.movies;

            query_interface.all_films_one_actor(1, saved_actor_with_100_movie, (err, movies) => {
                movies.length.should.eql(100);
                done();
            });
        });

    });


    describe('Version 2', function () {

        var saved_movie_with_1_actor;
        var saved_movie_with_10_actor;
        var saved_movie_with_100_actor;
        var saved_actor_with_1_movie;
        var saved_actor_with_10_movie;
        var saved_actor_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_actor = util.fakeMovie();
            saved_movie_with_10_actor = util.fakeMovie();
            saved_movie_with_100_actor = util.fakeMovie();
            saved_actor_with_1_movie = util.fakeActor();
            saved_actor_with_10_movie = util.fakeActor();
            saved_actor_with_100_movie = util.fakeActor();


            all_saved.push(save_interface.save(2,
                {movie: saved_movie_with_1_actor, actor: saved_actor_with_1_movie,
                    director : util.fakeDirector()}))

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 100; i++) {
                    if (i < 10)
                        all_saved.push(save_interface.save(2, {
                            movie: util.fakeMovie(),
                            actor: saved_actor_with_10_movie,
                            director : util.fakeDirector()
                        }));
                    all_saved.push(save_interface.save(2, {
                        movie: util.fakeMovie(),
                        actor: saved_actor_with_100_movie,
                        director : util.fakeDirector()
                    }));
                }
                q.all(all_saved).then(() => done())
            })
        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves 1 movie', function (done) {

            // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor_with_1_movie.movies;

            query_interface.all_films_one_actor(2, saved_actor_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_actor.title);
                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeActor() adds 'movies' field to Actor object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor_with_10_movie.movies;

            query_interface.all_films_one_actor(2, saved_actor_with_10_movie, (err, movies) => {
                movies.length.should.eql(10);
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_actor_with_100_movie.movies;

            query_interface.all_films_one_actor(2, saved_actor_with_100_movie, (err, movies) => {
                movies.length.should.eql(100);
                done();
            });
        });

    });


});
