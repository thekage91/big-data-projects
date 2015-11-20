/**
 * Created by ugo on 14/11/15.
 */
'use strict';

var express = require('express'),
    util = require('../util.js'),
    q = require('q'),
    should = require('should-promised');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var mongoose = app.mongoose;
var save_interface = require('../../models/save_interface.js'),
    Movie0 = mongoose.model('Movie0'),
    Movie1 = mongoose.model('Movie1'),
    Actor1 = mongoose.model('Actor1'),
    Movie2 = mongoose.model('Movie2'),
    Actor2 = mongoose.model('Actor2'),
    Director2 = mongoose.model('Director2'),
    Movie3 = mongoose.model('Movie3'),
    Director3 = mongoose.model('Director3');;


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


            it('Does not create another identical movie', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then(() => {
                    Movie1.find({title: movie_to_save.title}, function (err, movies) {
                        movies.should.not.be.null();
                        movies.should.not.be.empty();
                        movies.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            })

            it('Adds (movie -> actor) association correctly to the same movie', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then((movie_actor_array) => {
                    Movie1.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.actors.length.should.be.equal(2);
                        movie.actors.indexOf(movie_actor_array[1]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Adds the correct (actor -> movie) association to a new actor', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then((movie_actor_array) => {
                    Actor1.findOne({
                    first_name: actor_to_save.first_name,
                    last_name: actor_to_save.last_name
                }, function (err, actor) {
                        actor.movies.length.should.be.eql(1);
                        actor.movies.indexOf(movie_actor_array[0]._id).should.not.eql(-1);
                        done();
                })
                }, (err) => {
                    throw new AssertionError(err)
                });


            });

            it('Does not create another identical actor', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.sameActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then(() => {
                    Actor1.find({
                        first_name: actor_to_save.first_name,
                        last_name: actor_to_save.last_name
                    }, (err,actors) => {
                        actors.should.not.be.null();
                        actors.should.not.be.empty();
                        actors.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Adds (actor -> movie) association correctly to the same actor', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.sameActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then((movie_actor_array) => {
                    Actor1.findOne({
                        first_name: actor_to_save.first_name,
                        last_name: actor_to_save.last_name
                    }, (err,actors) => {
                        actors.movies.length.should.be.equal(2);
                        actors.movies.indexOf(movie_actor_array[0]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

            it('Adds (movie -> actor) association correctly to a film', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.sameActor();

                var movie_saved = save_interface.save(1, {movie: movie_to_save, actor: actor_to_save});

                movie_saved.then((movie_actor_array) => {
                    Movie1.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.actors.length.should.be.equal(1);
                        movie.actors.indexOf(movie_actor_array[1]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

        })

    });

    describe('Version 2', function () {

        describe('No existing data', function () {

            afterEach('Clear database', function (done) {
                mongoose.connection.db.dropDatabase(function (err, ww) {
                    done();
                })
            });


            it('Saves one movie', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Movie2.find({title: movie_to_save.title}, function (err, movie) {
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
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Actor2.find({
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

            it('Saves one director', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Director2.find({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, function (err, director) {
                        if(err) throw err;
                        director.should.not.be.empty();
                        director.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)

                });
            });

            it('Saves the correct movie -> actor association', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Movie2.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.actors.should.not.be.empty();
                        Actor2.findById(movie.actors[0], function (err, actor) {
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
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Actor2.findOne({
                        first_name: actor_to_save.first_name,
                        last_name: actor_to_save.last_name
                    }, function (err, actor) {
                        actor.movies.should.not.be.empty();
                        Movie2.findById(actor.movies[0], function (err, movie) {
                            movie.should.not.be.empty();
                            done();
                        })
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Saves the correct movie -> director association', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Movie2.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.directors.should.not.be.empty();
                        Director2.findById(movie.directors[0], function (err, actor) {
                            actor.should.not.be.empty();
                            done();
                        })

                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });


            it('Saves the correct director -> movie association', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Director2.findOne({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, function (err, director) {
                        director.movies.should.not.be.empty();
                        Movie2.findById(director.movies[0], function (err, movie) {
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

            beforeEach('Save film, actor and director',  function (done) {
                var movie_to_save = util.sameMovie();
                var actor_to_save = util.sameActor();
                var director_to_save = util.sameDirector() ;

                save_interface.save(2,{movie: movie_to_save, actor: actor_to_save, director: director_to_save})
                    .then(() => done());
            });


            it('Does not create another identical movie', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Movie2.find({title: movie_to_save.title}, function (err, movies) {
                        movies.should.not.be.null();
                        movies.should.not.be.empty();
                        movies.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            })

            it('Adds (movie -> actor) association correctly to the same movie', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then((movie_actor_director_array) => {
                    Movie2.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.actors.length.should.be.equal(2);
                        movie.actors.indexOf(movie_actor_director_array[1]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Adds the correct (actor -> movie) association to a new actor', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then((movie_actor_director_array) => {
                    Actor2.findOne({
                        first_name: actor_to_save.first_name,
                        last_name: actor_to_save.last_name
                    }, function (err, actor) {
                        actor.movies.length.should.be.eql(1);
                        actor.movies.indexOf(movie_actor_director_array[0]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });


            });

            it('Adds the correct (director -> movie) association to a new director', function (done) {

                var movie_to_save = util.sameMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then((movie_actor_director_array) => {
                    Director2.findOne({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, function (err, director) {
                        director.movies.length.should.be.eql(1);
                        director.movies.indexOf(movie_actor_director_array[0]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });


            });


            it('Does not create another identical actor', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.sameActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Actor2.find({
                        first_name: actor_to_save.first_name,
                        last_name: actor_to_save.last_name
                    }, (err,actors) => {
                        actors.should.not.be.null();
                        actors.should.not.be.empty();
                        actors.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Adds (actor -> movie) association correctly to the same actor', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.sameActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then((movie_actor_director_array) => {
                    Actor2.findOne({
                        first_name: actor_to_save.first_name,
                        last_name: actor_to_save.last_name
                    }, (err,actors) => {
                        actors.movies.length.should.be.equal(2);
                        actors.movies.indexOf(movie_actor_director_array[0]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

            it('Adds (movie -> actor) association correctly to a film', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.sameActor();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then((movie_actor_array) => {
                    Movie2.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.actors.length.should.be.equal(1);
                        movie.actors.indexOf(movie_actor_array[1]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

            it('Does not create another identical director', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.sameDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then(() => {
                    Director2.find({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, (err,directors) => {
                        directors.should.not.be.empty();
                        directors.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Adds (director -> movie) association correctly to the same director', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.sameDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then((movie_actor_director_array) => {
                    Director2.findOne({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, (err,directors) => {
                        directors.movies.length.should.be.equal(2);
                        directors.movies.indexOf(movie_actor_director_array[0]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

            it('Adds (movie -> director) association correctly to a movie', function (done) {

                var movie_to_save = util.fakeMovie();
                var actor_to_save = util.fakeActor();
                var director_to_save = util.sameDirector();

                var movie_saved = save_interface.save(2,
                    {movie: movie_to_save, actor: actor_to_save, director: director_to_save});

                movie_saved.then((movie_actor_director_array) => {
                    Movie2.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.directors.length.should.be.equal(1);
                        movie.directors.indexOf(movie_actor_director_array[2]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

        })

    });

    describe('Version 3', function () {

        describe('No existing data', function () {

            afterEach('Clear database', function (done) {
                mongoose.connection.db.dropDatabase(function (err, ww) {
                    done();
                })
            });


            it('Saves one movie', function (done) {

                var movie_to_save = util.fakeMovie();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});

                movie_saved.then(() => {
                    Movie3.find({title: movie_to_save.title}, function (err, movie) {
                        movie.should.not.be.null();
                        movie.should.not.be.empty();
                        movie.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            })


            it('Saves one director', function (done) {

                var movie_to_save = util.fakeMovie();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});

                movie_saved.then(() => {
                    Director3.find({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, function (err, director) {
                        if(err) throw err;
                        director.should.not.be.empty();
                        director.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)

                });
            });


            it('Saves the correct movie -> director association', function (done) {

                var movie_to_save = util.fakeMovie();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});

                movie_saved.then(() => {
                    Movie3.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.directors.should.not.be.empty();
                        Director3.findById(movie.directors[0], function (err, director) {
                            director.should.not.be.empty();
                            done();
                        })

                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });


            it('Saves the correct director -> movie association', function (done) {

                var movie_to_save = util.fakeMovie();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});

                movie_saved.then(() => {
                    Director3.findOne({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, function (err, director) {
                        director.movies.should.not.be.empty();
                        Movie3.findById(director.movies[0], function (err, movie) {
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

            beforeEach('Save film and director',  function (done) {
                var movie_to_save = util.sameMovie();
                var director_to_save = util.sameDirector() ;

                save_interface.save(3,{movie: movie_to_save,director: director_to_save})
                    .then(() => done());
            });


            it('Does not create another identical movie', function (done) {

                var movie_to_save = util.sameMovie();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});

                movie_saved.then(() => {
                    Movie3.find({title: movie_to_save.title}, function (err, movies) {
                        movies.should.not.be.null();
                        movies.should.not.be.empty();
                        movies.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            })


            it('Adds the correct (director -> movie) association to a new director', function (done) {

                var movie_to_save = util.sameMovie();
                var director_to_save = util.fakeDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});


                movie_saved.then((movie_actor_director_array) => {
                    Director3.findOne({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, function (err, director) {
                        director.movies.length.should.be.eql(1);
                        director.movies.indexOf(movie_actor_director_array[0]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });


            });

            it('Does not create another identical director', function (done) {

                var movie_to_save = util.fakeMovie();
                var director_to_save = util.sameDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});


                movie_saved.then(() => {
                    Director3.find({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, (err,directors) => {
                        directors.should.not.be.empty();
                        directors.length.should.be.equal(1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });

            });

            it('Adds (director -> movie) association correctly to the same director', function (done) {

                var movie_to_save = util.fakeMovie();
                var director_to_save = util.sameDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});


                movie_saved.then((movie_director_array) => {
                    Director3.findOne({
                        first_name: director_to_save.first_name,
                        last_name: director_to_save.last_name
                    }, (err,directors) => {
                        directors.movies.length.should.be.equal(2);
                        directors.movies.indexOf(movie_director_array[0]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

            it('Adds (movie -> director) association correctly to a movie', function (done) {

                var movie_to_save = util.fakeMovie();
                var director_to_save = util.sameDirector();

                var movie_saved = save_interface.save(3,{movie: movie_to_save,director: director_to_save});

                movie_saved.then((movie_director_array) => {
                    Movie3.findOne({title: movie_to_save.title}, function (err, movie) {
                        movie.directors.length.should.be.equal(1);
                        movie.directors.indexOf(movie_director_array[1]._id).should.not.eql(-1);
                        done();
                    })
                }, (err) => {
                    throw new AssertionError(err)
                });
            });

        })

    });
});

