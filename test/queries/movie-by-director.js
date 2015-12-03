/**
 * Created by ugo on 01/12/15.
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

describe('Query: Retrieve all movies acted by one director', function () {


    it("fails with wrong 'version' argument", function (done) {

        //(query_interface.all_films_one_director('a', (util.fakeMovie()))).should.throw(Error);

        try {
            query_interface.all_films_one_director('A', (util.fakeMovie()));
        }
        catch (err) {
            err.should.be.Error();
            done();
        }
    });

    it("fails with undefined 'director' argument", function (done) {

        //query_interface.all_films_one_director(1, null).should.throw(Error);

        try {
            query_interface.all_films_one_director(1, undefined);
        }
        catch (err) {
            err.should.be.Error();
            done();
        }
    });


    describe('Version 0', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director_with_1_movie;
        var saved_director_with_10_movie;
        var saved_director_with_100_movie;
        var saved_director;
        var saved_genre;

        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_director_with_1_movie = util.fakeDirector();
            saved_director_with_10_movie = util.fakeDirector();
            saved_director_with_100_movie = util.fakeDirector();
            saved_director = util.fakeDirector();
            saved_genre = util.fakeGenre();


            all_saved.push(save_interface.save(0,
                {
                    movie: saved_movie_with_1_director, director: saved_director_with_1_movie,
                    actor: util.fakeActor(), genre: saved_genre
                }))


            all_saved.push(save_interface.save(0,
                {movie: saved_movie_with_10_director}))


            all_saved.push(save_interface.save(0,
                {movie: saved_movie_with_100_director}))

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 100; i++) {
                    if (i < 10)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(),
                            director: saved_director_with_10_movie
                        }));
                    all_saved.push(save_interface.save(0, {
                        movie: util.fakeMovie(),
                        director: saved_director_with_100_movie
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

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_1_movie.movies;

            query_interface.all_films_one_director(0, saved_director_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_director.title);
                done();
            })
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            delete saved_director_with_10_movie.movies;

            query_interface.all_films_one_director(0, saved_director_with_10_movie, (err, movies) => {
                movies.length.should.eql(10);
                for (let i = 0; i < movies.length; i++)
                    movies[i].directors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name);
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            delete saved_director_with_100_movie.movies;

            query_interface.all_films_one_director(0, saved_director_with_100_movie, (err, movies) => {
                movies.length.should.eql(100);
                for (let i = 0; i < movies.length; i++) {
                    movies[i].directors[1] = movies[i].directors[1] || {};
                    [movies[i].directors[0].first_name, movies[i].directors[1].first_name]
                        .should.containEql(saved_director_with_100_movie.first_name);
                }
                done();
            });
        });

    });


    describe('Version 1', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director_with_1_movie;
        var saved_director_with_10_movie;
        var saved_director_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_director_with_1_movie = util.fakeDirector();
            saved_director_with_10_movie = util.fakeDirector();
            saved_director_with_100_movie = util.fakeDirector();


            all_saved.push(save_interface.save(1,
                {movie: saved_movie_with_1_director, director: saved_director_with_1_movie
                , actor: util.fakeActor()}))

            all_saved.push(save_interface.save(1,
                {movie: util.fakeMovie(), director: saved_director_with_10_movie
                    , actor: util.fakeActor()}))

            all_saved.push(save_interface.save(1,
                {movie: util.fakeMovie(), director: saved_director_with_100_movie
                    , actor: util.fakeActor()}))

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 99; i++) {
                    if (i < 9)
                        all_saved.push(save_interface.save(1, {
                            movie: util.fakeMovie(),
                            director: saved_director_with_10_movie,
                            actor: util.fakeActor()
                        }));
                    all_saved.push(save_interface.save(1, {
                        movie: util.fakeMovie(),
                        director: saved_director_with_100_movie,
                        actor: util.fakeActor()
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

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_1_movie.movies;

            query_interface.all_films_one_director(1, saved_director_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_director.title);
                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_10_movie.movies;

            query_interface.all_films_one_director(1, saved_director_with_10_movie, (err, movies) => {
                movies.length.should.eql(10);
                movies.forEach(
                    (movie) => movie.actors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name));
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_director_with_100_movie.movies;

            query_interface.all_films_one_director(1, saved_director_with_100_movie, (err, movies) => {
                movies.length.should.eql(100);
                movies.forEach(
                    (movie) => movie.actors[0].first_name.should.be.eql(saved_director_with_100_movie.first_name));
                done();
            });
        });

    });


    describe('Version 2', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director_with_1_movie;
        var saved_director_with_10_movie;
        var saved_director_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_director_with_1_movie = util.fakeDirector();
            saved_director_with_10_movie = util.fakeDirector();
            saved_director_with_100_movie = util.fakeDirector();


            all_saved.push(save_interface.save(2,
                {movie: saved_movie_with_1_director, director: saved_director_with_1_movie,
                    actor : util.fakeActor()}));

            all_saved.push(save_interface.save(2,
                {movie: util.fakeMovie(), director: saved_director_with_10_movie
                    , actor: util.fakeActor()}));

            all_saved.push(save_interface.save(2,
                {movie: util.fakeMovie(), director: saved_director_with_100_movie
                    , actor: util.fakeActor()}));

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 99; i++) {
                    if (i < 9)
                        all_saved.push(save_interface.save(2, {
                            movie: util.fakeMovie(),
                            director: saved_director_with_10_movie,
                            actor : util.fakeActor()
                        }));
                    all_saved.push(save_interface.save(2, {
                        movie: util.fakeMovie(),
                        director: saved_director_with_100_movie,
                        actor : util.fakeActor()
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

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_1_movie.movies;

            query_interface.all_films_one_director(2, saved_director_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_director.title);

                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_10_movie.movies;

            query_interface.all_films_one_director(2, saved_director_with_10_movie, (err, movies) => {
                movies.length.should.eql(10);
                movies.forEach(
                    (movie) => movie.actors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name));
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_director_with_100_movie.movies;

            query_interface.all_films_one_director(2, saved_director_with_100_movie, (err, movies) => {
                movies.length.should.eql(100);
                movies.forEach(
                    (movie) => movie.actors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name));
                done();
            });
        });

    });

    describe('Version 3', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director_with_1_movie;
        var saved_director_with_10_movie;
        var saved_director_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_director_with_1_movie = util.fakeDirector();
            saved_director_with_10_movie = util.fakeDirector();
            saved_director_with_100_movie = util.fakeDirector();


            all_saved.push(save_interface.save(3,
                {movie: saved_movie_with_1_director, director: saved_director_with_1_movie }));

            all_saved.push(save_interface.save(3,
                {movie: util.fakeMovie(), director: saved_director_with_10_movie }));

            all_saved.push(save_interface.save(3,
                {movie: util.fakeMovie(), director: saved_director_with_100_movie }));


            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 99; i++) {
                    if (i < 9)
                        all_saved.push(save_interface.save(3, {
                            movie: util.fakeMovie(),
                            director: saved_director_with_10_movie
                        }));
                    all_saved.push(save_interface.save(3, {
                        movie: util.fakeMovie(),
                        director: saved_director_with_100_movie
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

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_1_movie.movies;

            query_interface.all_films_one_director(3, saved_director_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_director.title);
                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_10_movie.movies;

            query_interface.all_films_one_director(3, saved_director_with_10_movie, (err, movies) => {
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name));
                movies.length.should.eql(10);
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_director_with_100_movie.movies;

            query_interface.all_films_one_director(3, saved_director_with_100_movie, (err, movies) => {
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_100_movie.first_name));
                movies.length.should.eql(100);
                done();
            });
        });

    });

    describe('Version 4', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director_with_1_movie;
        var saved_director_with_10_movie;
        var saved_director_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_director_with_1_movie = util.fakeDirector();
            saved_director_with_10_movie = util.fakeDirector();
            saved_director_with_100_movie = util.fakeDirector();


            all_saved.push(save_interface.save(4,
                {movie: saved_movie_with_1_director, director: saved_director_with_1_movie,
                    genre : util.fakeGenre()}));
            all_saved.push(save_interface.save(4,
                {movie: util.fakeMovie(), director: saved_director_with_10_movie,
                    genre : util.fakeGenre()}));
            all_saved.push(save_interface.save(4,
                {movie: util.fakeMovie(), director: saved_director_with_100_movie,
                    genre : util.fakeGenre()}));

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 99; i++) {
                    if (i < 9)
                        all_saved.push(save_interface.save(4, {
                            movie: util.fakeMovie(),
                            director: saved_director_with_10_movie,
                            genre : util.fakeGenre()
                        }));
                    all_saved.push(save_interface.save(4, {
                        movie: util.fakeMovie(),
                        director: saved_director_with_100_movie,
                        genre : util.fakeGenre()
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

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_1_movie.movies;

            query_interface.all_films_one_director(4, saved_director_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_director.title);
                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_10_movie.movies;

            query_interface.all_films_one_director(4, saved_director_with_10_movie, (err, movies) => {
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name));
                movies.length.should.eql(10);
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_director_with_100_movie.movies;

            query_interface.all_films_one_director(4, saved_director_with_100_movie, (err, movies) => {
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_100_movie.first_name));
                movies.length.should.eql(100);
                done();
            });
        });

    });

    describe('Version 5', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director_with_1_movie;
        var saved_director_with_10_movie;
        var saved_director_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_director_with_1_movie = util.fakeDirector();
            saved_director_with_10_movie = util.fakeDirector();
            saved_director_with_100_movie = util.fakeDirector();


            all_saved.push(save_interface.save(5,
                {movie: saved_movie_with_1_director, director: saved_director_with_1_movie,
                    genre : util.fakeGenre()}));
            all_saved.push(save_interface.save(5,
                {movie: util.fakeMovie(), director: saved_director_with_10_movie,
                    genre : util.fakeGenre()}));
            all_saved.push(save_interface.save(5,
                {movie: util.fakeMovie(), director: saved_director_with_100_movie,
                    genre : util.fakeGenre()}));


            q.all(all_saved).then(() => { done();
                let all_saved = [];
                for (let i = 0; i < 99; i++) {
                    if (i < 9)
                        all_saved.push(save_interface.save(5, {
                            movie: util.fakeMovie(),
                            director: saved_director_with_10_movie,
                            genre : util.fakeGenre()
                        }));
                    all_saved.push(save_interface.save(5, {
                        movie: util.fakeMovie(),
                        director: saved_director_with_100_movie,
                        genre : util.fakeGenre()
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

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_1_movie.movies;

            query_interface.all_films_one_director(5, saved_director_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_director.title);
                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_10_movie.movies;

            query_interface.all_films_one_director(5, saved_director_with_10_movie, (err, movies) => {
                movies.length.should.eql(10);
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name));
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_director_with_100_movie.movies;

            query_interface.all_films_one_director(5, saved_director_with_100_movie, (err, movies) => {
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_100_movie.first_name));
                movies.length.should.eql(100);
                done();
            });
        });

    });

    describe('Version 6', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director_with_1_movie;
        var saved_director_with_10_movie;
        var saved_director_with_100_movie;


        before('Populate database', function (done) {

            let all_saved = [];
            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_director_with_1_movie = util.fakeDirector();
            saved_director_with_10_movie = util.fakeDirector();
            saved_director_with_100_movie = util.fakeDirector();


            all_saved.push(save_interface.save(6,
                {movie: saved_movie_with_1_director, director: saved_director_with_1_movie,
                    actor : util.fakeActor(),  genre : util.fakeGenre()}));
            all_saved.push(save_interface.save(6,
                {movie: util.fakeMovie(), director: saved_director_with_10_movie,
                    actor : util.fakeActor(),genre : util.fakeGenre()}));
            all_saved.push(save_interface.save(6,
                {movie: util.fakeMovie(), director: saved_director_with_100_movie,
                    actor : util.fakeActor(),genre : util.fakeGenre()}));

            q.all(all_saved).then(() => {
                let all_saved = [];
                for (let i = 0; i < 99; i++) {
                    if (i < 9)
                        all_saved.push(save_interface.save(6, {
                            movie: util.fakeMovie(),
                            director: saved_director_with_10_movie,
                            actor : util.fakeActor(),
                            genre : util.fakeGenre()
                        }));
                    all_saved.push(save_interface.save(6, {
                        movie: util.fakeMovie(),
                        director: saved_director_with_100_movie,
                        actor : util.fakeActor(),
                        genre : util.fakeGenre()
                    }));
                }
                q.all(all_saved).then(() => done())
            });
        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves 1 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_1_movie.movies;

            query_interface.all_films_one_director(6, saved_director_with_1_movie, (err, movies) => {
                movies.length.should.eql(1);
                movies[0].title.should.eql(saved_movie_with_1_director.title);
                done();
            });
        });

        it('Retrieves 10 movie', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director_with_10_movie.movies;

            query_interface.all_films_one_director(6, saved_director_with_10_movie, (err, movies) => {
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_10_movie.first_name));
                movies.length.should.eql(10);
                done();
            });
        });

        it('Retrieves 100 movie', function (done) {

            delete saved_director_with_100_movie.movies;

            query_interface.all_films_one_director(6, saved_director_with_100_movie, (err, movies) => {
                movies.forEach(
                    (movie) => movie.directors[0].first_name.should.be.eql(saved_director_with_100_movie.first_name));
                movies.length.should.eql(100);
                done();
            });
        });

    });
});
