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

describe('Query: Retrieve first 5 actors which acted more times with a certain director', function () {

    it("fails with wrong 'version' argument", function (done) {


        try {
            query_interface.top_5_actors_of_a_director('A', (util.fakeDirector()));
        }
        catch (err) {
            err.should.be.Error();
            done();
        }
    });

    it("fails with undefined 'director' argument", function (done) {

        try {
            query_interface.top_5_actors_of_a_director(1, undefined);
        }
        catch (err) {
            err.should.be.Error();
            done();
        }
    });


    describe('Version 0', function () {

        var saved_director;
        var saved_actor_1_movies;
        var saved_actor_2_movies;
        var saved_actor_3_movies;
        var saved_actor_4_movies;
        var saved_actor_5_movies;
        var saved_actor_6_movies;
        var saved_actor_10_movies;
        var saved_actor_100_movies;

        before('Populate database', function (done) {

            saved_actor_1_movies = util.fakeActor();
            saved_actor_2_movies = util.fakeActor();
            saved_actor_3_movies = util.fakeActor();
            saved_actor_4_movies = util.fakeActor();
            saved_actor_5_movies = util.fakeActor();
            saved_actor_6_movies = util.fakeActor();
            saved_actor_10_movies = util.fakeActor();
            saved_actor_100_movies = util.fakeActor();
            saved_director = util.fakeDirector();



                let all_saved = [];
                for (let i = 0; i < 100; i++) {
                        if(i>98)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_1_movies, genre: util.fakeGenre()
                        }));
                    if (i > 97)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_2_movies, genre: util.fakeGenre()
                        }));
                    if (i > 96)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_3_movies, genre: util.fakeGenre()
                        }));
                    if (i > 95)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_4_movies, genre: util.fakeGenre()
                        }));
                    if (i > 94)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_5_movies, genre: util.fakeGenre()
                        }));
                    if (i > 93)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_6_movies, genre: util.fakeGenre()
                        }));
                    if (i > 89)
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_10_movies, genre: util.fakeGenre()
                        }));
                    all_saved.push(save_interface.save(0, {
                        movie: util.fakeMovie(), director: saved_director,
                        actor: saved_actor_100_movies, genre: util.fakeGenre()
                    }))


                }
                q.all(all_saved).then(() => done())
        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 actors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director.movies;

            query_interface.top_5_actors_of_a_director(0, saved_director, (err, actors) => {

                actors.length.should.be.eql(5);
                actors[0].id.should.be.eql(''+saved_actor_100_movies.first_name+saved_actor_100_movies.last_name);
                actors[1].id.should.be.eql(''+saved_actor_10_movies.first_name+saved_actor_10_movies.last_name);
                actors[2].id.should.be.eql(''+saved_actor_6_movies.first_name+saved_actor_6_movies.last_name);
                actors[3].id.should.be.eql(''+saved_actor_5_movies.first_name+saved_actor_5_movies.last_name);
                actors[4].id.should.be.eql(''+saved_actor_4_movies.first_name+saved_actor_4_movies.last_name);
                done();
            });


        });
    })


    describe('Version 1', function () {

        var saved_movie_with_1_director;
        var saved_movie_with_10_director;
        var saved_movie_with_100_director;
        var saved_director;
        var saved_genre;
        var saved_actor_1_movies;
        var saved_actor_2_movies;
        var saved_actor_3_movies;
        var saved_actor_4_movies;
        var saved_actor_5_movies;
        var saved_actor_6_movies;
        var saved_actor_10_movies;
        var saved_actor_100_movies;

        before('Populate database', function (done) {

            saved_movie_with_1_director = util.fakeMovie();
            saved_movie_with_10_director = util.fakeMovie();
            saved_movie_with_100_director = util.fakeMovie();
            saved_actor_1_movies = util.fakeActor();
            saved_actor_2_movies = util.fakeActor();
            saved_actor_3_movies = util.fakeActor();
            saved_actor_4_movies = util.fakeActor();
            saved_actor_5_movies = util.fakeActor();
            saved_actor_6_movies = util.fakeActor();
            saved_actor_10_movies = util.fakeActor();
            saved_actor_100_movies = util.fakeActor();


            saved_director = util.fakeDirector();
            saved_genre = util.fakeGenre();



            let all_saved = [];

            all_saved.push(save_interface.save(1, {
                movie: util.fakeMovie(), director: saved_director,
                actor: saved_actor_1_movies, genre: util.fakeGenre()
            }));
            all_saved.push(save_interface.save(1, {
                movie: util.fakeMovie(), director: saved_director,
                actor: saved_actor_2_movies, genre: util.fakeGenre()
            }));

             all_saved.push(save_interface.save(1, {
             movie: util.fakeMovie(), director: saved_director,
             actor: saved_actor_3_movies, genre: util.fakeGenre()
             }));

             all_saved.push(save_interface.save(1, {
             movie: util.fakeMovie(), director: saved_director,
             actor: saved_actor_4_movies, genre: util.fakeGenre()
             }));

             all_saved.push(save_interface.save(1, {
             movie: util.fakeMovie(), director: saved_director,
             actor: saved_actor_5_movies, genre: util.fakeGenre()
             }));

             all_saved.push(save_interface.save(1, {
             movie: util.fakeMovie(), director: saved_director,
             actor: saved_actor_6_movies, genre: util.fakeGenre()
             }));

             all_saved.push(save_interface.save(1, {
             movie: util.fakeMovie(), director: saved_director,
             actor: saved_actor_10_movies, genre: util.fakeGenre()
             }));

             all_saved.push(save_interface.save(1, {
             movie: util.fakeMovie(), director: saved_director,
             actor: saved_actor_100_movies, genre: util.fakeGenre()
             }));

            q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                        all_saved.push(save_interface.save(1, {
                            movie: util.fakeMovie(), director: saved_director,
                            actor: saved_actor_2_movies, genre: util.fakeGenre()
                        }));
                    if (i > 96)
                     all_saved.push(save_interface.save(1, {
                     movie: util.fakeMovie(), director: saved_director,
                     actor: saved_actor_3_movies, genre: util.fakeGenre()
                     }));
                     if (i > 95)
                     all_saved.push(save_interface.save(1, {
                     movie: util.fakeMovie(), director: saved_director,
                     actor: saved_actor_4_movies, genre: util.fakeGenre()
                     }));
                     if (i > 94)
                     all_saved.push(save_interface.save(1, {
                     movie: util.fakeMovie(), director: saved_director,
                     actor: saved_actor_5_movies, genre: util.fakeGenre()
                     }));
                     if (i > 93)
                     all_saved.push(save_interface.save(1, {
                     movie: util.fakeMovie(), director: saved_director,
                     actor: saved_actor_6_movies, genre: util.fakeGenre()
                     }));
                     if (i > 89)
                     all_saved.push(save_interface.save(1, {
                     movie: util.fakeMovie(), director: saved_director,
                     actor: saved_actor_10_movies, genre: util.fakeGenre()
                     }));
                     all_saved.push(save_interface.save(1, {
                     movie: util.fakeMovie(), director: saved_director,
                     actor: saved_actor_100_movies, genre: util.fakeGenre()
                     }));

                }
                q.all(all_saved).then(() => done())
            })

        });
/*
        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });*/

        it('Retrieves right top 5 actors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_director.movies;

            query_interface.top_5_actors_of_a_director(1, saved_director, (err, actors) => {
                if(err) throw err;
                console.log(actors);
                actors.length.should.be.eql(5);
                actors[0].id.should.be.eql(''+saved_actor_100_movies.first_name+saved_actor_100_movies.last_name);
                actors[1].id.should.be.eql(''+saved_actor_10_movies.first_name+saved_actor_10_movies.last_name);
                actors[2].id.should.be.eql(''+saved_actor_6_movies.first_name+saved_actor_6_movies.last_name);
                actors[3].id.should.be.eql(''+saved_actor_5_movies.first_name+saved_actor_5_movies.last_name);
                actors[4].id.should.be.eql(''+saved_actor_4_movies.first_name+saved_actor_4_movies.last_name);
                done();
            });


        });
    })

})
