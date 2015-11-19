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
var ObjectId = mongoose.Schema.Types.ObjectId;
var save_interface = require('../../models/save_interface.js'),
    Movie0 = mongoose.model('Movie0'),
    Movie1 = mongoose.model('Movie1'),
    Actor1 = mongoose.model('Actor1');


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
                    movie.should.not.be.empty();
                    movie.length.should.be.equal(1);
                    done();
                })
            });

        })

        it('saves two movies', function (done) {
            var movie_to_save_1 = util.fakeMovie();
            var movie_to_save_2 = util.fakeMovie();

            var movie_saved_1 = save_interface.save(0, {movie: movie_to_save_1});
            var movie_saved_2 = save_interface.save(0, {movie: movie_to_save_2});

            var saved_1 = q.defer(), saved_2 = q.defer();
            var both_saved = q.all([saved_1.promise,saved_2.promise]);

            movie_saved_1.then(() => {
                Movie0.find({title: movie_to_save_1.title}, function (err, movie) {
                    movie.should.not.be.null();
                    movie.should.not.be.empty();
                    movie.length.should.be.equal(1);
                    saved_1.resolve();
                })
            });

            movie_saved_2.then(() => {
                Movie0.find({title: movie_to_save_2.title}, function (err, movie) {
                    movie.should.not.be.null();
                    movie.should.not.be.empty();
                    movie.length.should.be.equal(1);
                    saved_2.resolve();
                })
            });

            both_saved.then(
                function () {done();},
                function () {throw new AssertionError('Failed saving two movies')});
        })

        it('does not save missing title', function (done) {
            var movie_to_save = util.fakeMovie();
            delete movie_to_save.title;

            var movie_saved = save_interface.save(0, {movie: movie_to_save});

            movie_saved.then(
                () => { throw new AssertionError('promise should not be resolved')},
                (err) => { err.should.be.Error(); done();});
        })

        it('does not save empty title', function (done) {
            var movie_to_save = util.fakeMovie();
            movie_to_save.title = "";

            var movie_saved = save_interface.save(0, {movie: movie_to_save});

            movie_saved.then(
                () => { throw new AssertionError('promise should not be resolved')},
                (err) => { err.should.be.Error(); done();});
        })

    })




    describe('Version 1', function () {

       describe('No existing data', function () {

           afterEach('Clear database', function (done) {
               mongoose.connection.db.dropDatabase(function (err, ww) {
                   done();
               })
           });


           it('Saves one movie', function (done) {

               var movie_to_save = util.fakeMovie();
               var actor_to_save = util.fakeActor();

               var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

               movie_saved.then(() => {
                   Movie1.find({title: movie_to_save.title}, function (err, movie) {
                       movie.should.not.be.null();
                       movie.should.not.be.empty();
                       movie.length.should.be.equal(1);
                       done();
                   })
               }, (err) => {
                   throw new AssertionError(err)
               });

           })

           it('Saves one actor', function (done) {

               var movie_to_save = util.fakeMovie();
               var actor_to_save = util.fakeActor();

               var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

               movie_saved.then(() => {
                   Actor1.find({
                       first_name: actor_to_save.first_name,
                       last_name: actor_to_save.last_name
                   }, function (err, actor) {
                       actor.should.not.be.null();
                       actor.should.not.be.empty();
                       actor.length.should.be.equal(1);
                       done();
                   })
               }, (err) => {
                   throw new AssertionError(err)
               });
           });

           it('Saves the correct movie -> actor association', function (done) {

               var movie_to_save = util.fakeMovie();
               var actor_to_save = util.fakeActor();

               var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

               movie_saved.then((data) => {
                   Movie1.findOne({title: movie_to_save.title}, function (err, movie) {
                       movie.actors.should.not.be.empty();
                       Actor1.findById(movie.actors[0], function (err, actor) {
                           actor.should.not.be.empty();
                           done();
                       })

                   })
               }, (err) => {
                   throw new AssertionError(err)
               });

           });

           it('Saves the correct actor -> movie association', function (done) {

               var movie_to_save = util.fakeMovie();
               var actor_to_save = util.fakeActor();

               var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

               movie_saved.then(() => {
                   Actor1.findOne({
                       first_name: actor_to_save.first_name,
                       last_name: actor_to_save.last_name
                   }, function (err, actor) {
                       actor.movies.should.not.be.empty();
                       Movie1.findById(actor.movies[0], function (err, movie) {
                           movie.should.not.be.empty();
                           done();
                       })
                   })
               }, (err) => {
                   throw new AssertionError(err)
               });

           });

       });


        describe('Overwrite existing data', function () {

            afterEach('Clear database', function (done) {
                mongoose.connection.db.dropDatabase(function (err, ww) {
                    done();
                })
            });

            beforeEach('Save film and actor',  function (done) {
                var movie_to_save = util.sameMovie();
                var actor_to_save = util.sameActor() ;

                save_interface.save(1, {movie: movie_to_save, actor: actor_to_save}).then( () => done());
            });


            it(' Does not create another movie', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then(() => {
                    Movie1.find({title: movie_to_save.title}, function (err, movie) {
                        movie.should.not.be.null();
                        movie.should.not.be.empty();
                        movie.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            })

            it('Saves another movie -> actor association correctly', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then(() => {
                    Movie1.find({title: movie_to_save.title}, function (err, movie) {
                        movie.should.not.be.null();
                        movie.should.not.be.empty();
                        movie.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Saves the correct movie -> actor association', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then(() => {
                    Movie1.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.actors.should.not.be.empty();
                        Actor1.findById(movie.actors[0], function (err, actor) {
                            actor.should.not.be.empty();
                            done();
                        })

                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Saves the correct actor -> movie association', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then(() => {
                    Actor1.findOne({
                        first_name: actor_to_save.first_name,
                        last_name: actor_to_save.last_name
                    }, function (err, actor) {
                        actor.movies.should.not.be.empty();
                        Movie1.findById(actor.movies[0], function (err, movie) {
                            movie.should.not.be.empty();
                            done();
                        })
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });*/

        })

    });
});

