/**
 * Created by ugo on 17/12/15.
 */



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

        var saved_actor;
        var saved_director_1_movies;
        var saved_director_2_movies;
        var saved_director_3_movies;
        var saved_director_4_movies;
        var saved_director_5_movies;
        var saved_director_6_movies;
        var saved_director_10_movies;
        var saved_director_100_movies;

        before('Populate database', function (done) {

            saved_director_1_movies = util.fakeDirector();
            saved_director_2_movies = util.fakeDirector();
            saved_director_3_movies = util.fakeDirector();
            saved_director_4_movies = util.fakeDirector();
            saved_director_5_movies = util.fakeDirector();
            saved_director_6_movies = util.fakeDirector();
            saved_director_10_movies = util.fakeDirector();
            saved_director_100_movies = util.fakeDirector();
            saved_actor = util.fakeActor();

            let all_saved = [];

            save_interface.save(0, {
                movie: util.fakeMovie(), director: saved_director_1_movies,
                actor: saved_actor, genre: util.fakeGenre()
            }).then( () => {

                all_saved.push(save_interface.save(0, {
                    movie: util.fakeMovie(), director: saved_director_2_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(0, {
                    movie: util.fakeMovie(), director: saved_director_3_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(0, {
                    movie: util.fakeMovie(), director: saved_director_4_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(0, {
                    movie: util.fakeMovie(), director: saved_director_5_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(0, {
                    movie: util.fakeMovie(), director: saved_director_6_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(0, {
                    movie: util.fakeMovie(), director: saved_director_100_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(0, {
                    movie: util.fakeMovie(), director: saved_director_10_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                            all_saved.push(save_interface.save(0, {
                                movie: util.fakeMovie(), director: saved_director_2_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 96)
                            all_saved.push(save_interface.save(0, {
                                movie: util.fakeMovie(), director: saved_director_3_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 95)
                            all_saved.push(save_interface.save(0, {
                                movie: util.fakeMovie(), director: saved_director_4_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 94)
                            all_saved.push(save_interface.save(0, {
                                movie: util.fakeMovie(), director: saved_director_5_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 93)
                            all_saved.push(save_interface.save(0, {
                                movie: util.fakeMovie(), director: saved_director_6_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 89)
                            all_saved.push(save_interface.save(0, {
                                movie: util.fakeMovie(), director: saved_director_10_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        all_saved.push(save_interface.save(0, {
                            movie: util.fakeMovie(), director: saved_director_100_movies,
                            actor: saved_actor, genre: util.fakeGenre()
                        }));

                    }
                    q.all(all_saved).then(() => done())
                })

            });
        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 directors', function (done) {

            // util.fakeActor() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor.movies;

            query_interface.top_5_directors_of_an_actor(0, saved_actor, (err, directors) => {

                console.log(directors);

                directors.length.should.be.eql(5);
                directors[0].id.should.be.eql(''+saved_director_100_movies.first_name+saved_director_100_movies.last_name);
                directors[1].id.should.be.eql(''+saved_director_10_movies.first_name+saved_director_10_movies.last_name);
                directors[2].id.should.be.eql(''+saved_director_6_movies.first_name+saved_director_6_movies.last_name);
                directors[3].id.should.be.eql(''+saved_director_5_movies.first_name+saved_director_5_movies.last_name);
                directors[4].id.should.be.eql(''+saved_director_4_movies.first_name+saved_director_4_movies.last_name);
                done();
            });


        });
    })


    describe('Version 1', function () {

        var saved_actor;
        var saved_genre;
        var saved_director_1_movies;
        var saved_director_2_movies;
        var saved_director_3_movies;
        var saved_director_4_movies;
        var saved_director_5_movies;
        var saved_director_6_movies;
        var saved_director_10_movies;
        var saved_director_100_movies;

        before('Populate database', function (done) {

            saved_director_1_movies = util.fakeActor();
            saved_director_2_movies = util.fakeActor();
            saved_director_3_movies = util.fakeActor();
            saved_director_4_movies = util.fakeActor();
            saved_director_5_movies = util.fakeActor();
            saved_director_6_movies = util.fakeActor();
            saved_director_10_movies = util.fakeActor();
            saved_director_100_movies = util.fakeActor();

            saved_actor = util.fakeActor();

            saved_genre = util.fakeGenre();



            let all_saved = [];

            save_interface.save(1, {
                movie: util.fakeMovie(), director: saved_director_1_movies,
                actor: saved_actor, genre: util.fakeGenre()
            }).then( () => {

                all_saved.push(save_interface.save(1, {
                    movie: util.fakeMovie(), director: saved_director_2_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(1, {
                    movie: util.fakeMovie(), director: saved_director_3_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(1, {
                    movie: util.fakeMovie(), director: saved_director_4_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(1, {
                    movie: util.fakeMovie(), director: saved_director_5_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(1, {
                    movie: util.fakeMovie(), director: saved_director_6_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(1, {
                    movie: util.fakeMovie(), director: saved_director_100_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(1, {
                    movie: util.fakeMovie(), director: saved_director_10_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                            all_saved.push(save_interface.save(1, {
                                movie: util.fakeMovie(), director: saved_director_2_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 96)
                            all_saved.push(save_interface.save(1, {
                                movie: util.fakeMovie(), director: saved_director_3_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 95)
                            all_saved.push(save_interface.save(1, {
                                movie: util.fakeMovie(), director: saved_director_4_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 94)
                            all_saved.push(save_interface.save(1, {
                                movie: util.fakeMovie(), director: saved_director_5_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 93)
                            all_saved.push(save_interface.save(1, {
                                movie: util.fakeMovie(), director: saved_director_6_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 89)
                            all_saved.push(save_interface.save(1, {
                                movie: util.fakeMovie(), director: saved_director_10_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        all_saved.push(save_interface.save(1, {
                            movie: util.fakeMovie(), director: saved_director_100_movies,
                            actor: saved_actor, genre: util.fakeGenre()
                        }));

                    }
                    q.all(all_saved).then(() => done())
                })

            });

        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 directors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor.movies;

            query_interface.top_5_directors_of_an_actor(1, saved_actor, (err, directors) => {
                if(err) throw err;

                console.log(directors);

                directors.length.should.be.eql(5);
                directors[0].id.should.be.eql(''+saved_director_100_movies.first_name+saved_director_100_movies.last_name);
                directors[1].id.should.be.eql(''+saved_director_10_movies.first_name+saved_director_10_movies.last_name);
                directors[2].id.should.be.eql(''+saved_director_6_movies.first_name+saved_director_6_movies.last_name);
                directors[3].id.should.be.eql(''+saved_director_5_movies.first_name+saved_director_5_movies.last_name);
                directors[4].id.should.be.eql(''+saved_director_4_movies.first_name+saved_director_4_movies.last_name);
                done();
            });


        });
    })


    describe('Version 2', function () {

        var saved_actor;
        var saved_genre;
        var saved_director_1_movies;
        var saved_director_2_movies;
        var saved_director_3_movies;
        var saved_director_4_movies;
        var saved_director_5_movies;
        var saved_director_6_movies;
        var saved_director_10_movies;
        var saved_director_100_movies;

        before('Populate database', function (done) {

            saved_director_1_movies = util.fakeActor();
            saved_director_2_movies = util.fakeActor();
            saved_director_3_movies = util.fakeActor();
            saved_director_4_movies = util.fakeActor();
            saved_director_5_movies = util.fakeActor();
            saved_director_6_movies = util.fakeActor();
            saved_director_10_movies = util.fakeActor();
            saved_director_100_movies = util.fakeActor();

            saved_actor = util.fakeActor();

            saved_genre = util.fakeGenre();



            let all_saved = [];

            save_interface.save(2, {
                movie: util.fakeMovie(), director: saved_director_1_movies,
                actor: saved_actor, genre: util.fakeGenre()
            }).then( () => {

                all_saved.push(save_interface.save(2, {
                    movie: util.fakeMovie(), director: saved_director_2_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(2, {
                    movie: util.fakeMovie(), director: saved_director_3_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(2, {
                    movie: util.fakeMovie(), director: saved_director_4_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(2, {
                    movie: util.fakeMovie(), director: saved_director_5_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(2, {
                    movie: util.fakeMovie(), director: saved_director_6_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(2, {
                    movie: util.fakeMovie(), director: saved_director_100_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(2, {
                    movie: util.fakeMovie(), director: saved_director_10_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                            all_saved.push(save_interface.save(2, {
                                movie: util.fakeMovie(), director: saved_director_2_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 96)
                            all_saved.push(save_interface.save(2, {
                                movie: util.fakeMovie(), director: saved_director_3_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 95)
                            all_saved.push(save_interface.save(2, {
                                movie: util.fakeMovie(), director: saved_director_4_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 94)
                            all_saved.push(save_interface.save(2, {
                                movie: util.fakeMovie(), director: saved_director_5_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 93)
                            all_saved.push(save_interface.save(2, {
                                movie: util.fakeMovie(), director: saved_director_6_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 89)
                            all_saved.push(save_interface.save(2, {
                                movie: util.fakeMovie(), director: saved_director_10_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        all_saved.push(save_interface.save(2, {
                            movie: util.fakeMovie(), director: saved_director_100_movies,
                            actor: saved_actor, genre: util.fakeGenre()
                        }));

                    }
                    q.all(all_saved).then(() => done())
                })

            });

        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 directors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor.movies;

            query_interface.top_5_directors_of_an_actor(2, saved_actor, (err, directors) => {
                if(err) throw err;

                console.log(directors);

                directors.length.should.be.eql(5);
                directors[0].id.should.be.eql(''+saved_director_100_movies.first_name+saved_director_100_movies.last_name);
                directors[1].id.should.be.eql(''+saved_director_10_movies.first_name+saved_director_10_movies.last_name);
                directors[2].id.should.be.eql(''+saved_director_6_movies.first_name+saved_director_6_movies.last_name);
                directors[3].id.should.be.eql(''+saved_director_5_movies.first_name+saved_director_5_movies.last_name);
                directors[4].id.should.be.eql(''+saved_director_4_movies.first_name+saved_director_4_movies.last_name);
                done();
            });


        });
    })


    describe('Version 3', function () {

        var saved_actor;
        var saved_genre;
        var saved_director_1_movies;
        var saved_director_2_movies;
        var saved_director_3_movies;
        var saved_director_4_movies;
        var saved_director_5_movies;
        var saved_director_6_movies;
        var saved_director_10_movies;
        var saved_director_100_movies;

        before('Populate database', function (done) {

            saved_director_1_movies = util.fakeActor();
            saved_director_2_movies = util.fakeActor();
            saved_director_3_movies = util.fakeActor();
            saved_director_4_movies = util.fakeActor();
            saved_director_5_movies = util.fakeActor();
            saved_director_6_movies = util.fakeActor();
            saved_director_10_movies = util.fakeActor();
            saved_director_100_movies = util.fakeActor();

            saved_actor = util.fakeActor();

            saved_genre = util.fakeGenre();



            let all_saved = [];

            save_interface.save(3, {
                movie: util.fakeMovie(), director: saved_director_1_movies,
                actor: saved_actor, genre: util.fakeGenre()
            }).then( () => {

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_2_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_3_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_4_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_5_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_6_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_100_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_10_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                            all_saved.push(save_interface.save(3, {
                                movie: util.fakeMovie(), director: saved_director_2_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 96)
                            all_saved.push(save_interface.save(3, {
                                movie: util.fakeMovie(), director: saved_director_3_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 95)
                            all_saved.push(save_interface.save(3, {
                                movie: util.fakeMovie(), director: saved_director_4_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 94)
                            all_saved.push(save_interface.save(3, {
                                movie: util.fakeMovie(), director: saved_director_5_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 93)
                            all_saved.push(save_interface.save(3, {
                                movie: util.fakeMovie(), director: saved_director_6_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 89)
                            all_saved.push(save_interface.save(3, {
                                movie: util.fakeMovie(), director: saved_director_10_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        all_saved.push(save_interface.save(3, {
                            movie: util.fakeMovie(), director: saved_director_100_movies,
                            actor: saved_actor, genre: util.fakeGenre()
                        }));

                    }
                    q.all(all_saved).then(() => done())
                })

            });

        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 directors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor.movies;

            query_interface.top_5_directors_of_an_actor(3, saved_actor, (err, directors) => {
                if(err) throw err;

                console.log(directors);

                directors.length.should.be.eql(5);
                directors[0].id.should.be.eql(''+saved_director_100_movies.first_name+saved_director_100_movies.last_name);
                directors[1].id.should.be.eql(''+saved_director_10_movies.first_name+saved_director_10_movies.last_name);
                directors[2].id.should.be.eql(''+saved_director_6_movies.first_name+saved_director_6_movies.last_name);
                directors[3].id.should.be.eql(''+saved_director_5_movies.first_name+saved_director_5_movies.last_name);
                directors[4].id.should.be.eql(''+saved_director_4_movies.first_name+saved_director_4_movies.last_name);
                done();
            });


        });
    })


    describe('Version 4', function () {

        var saved_actor;
        var saved_genre;
        var saved_director_1_movies;
        var saved_director_2_movies;
        var saved_director_3_movies;
        var saved_director_4_movies;
        var saved_director_5_movies;
        var saved_director_6_movies;
        var saved_director_10_movies;
        var saved_director_100_movies;

        before('Populate database', function (done) {

            saved_director_1_movies = util.fakeActor();
            saved_director_2_movies = util.fakeActor();
            saved_director_3_movies = util.fakeActor();
            saved_director_4_movies = util.fakeActor();
            saved_director_5_movies = util.fakeActor();
            saved_director_6_movies = util.fakeActor();
            saved_director_10_movies = util.fakeActor();
            saved_director_100_movies = util.fakeActor();

            saved_actor = util.fakeActor();

            saved_genre = util.fakeGenre();



            let all_saved = [];

            save_interface.save(4, {
                movie: util.fakeMovie(), director: saved_director_1_movies,
                actor: saved_actor, genre: util.fakeGenre()
            }).then( () => {

                all_saved.push(save_interface.save(4, {
                    movie: util.fakeMovie(), director: saved_director_2_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(4, {
                    movie: util.fakeMovie(), director: saved_director_3_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(4, {
                    movie: util.fakeMovie(), director: saved_director_4_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(4, {
                    movie: util.fakeMovie(), director: saved_director_5_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(4, {
                    movie: util.fakeMovie(), director: saved_director_6_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(4, {
                    movie: util.fakeMovie(), director: saved_director_100_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(4, {
                    movie: util.fakeMovie(), director: saved_director_10_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                            all_saved.push(save_interface.save(4, {
                                movie: util.fakeMovie(), director: saved_director_2_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 96)
                            all_saved.push(save_interface.save(4, {
                                movie: util.fakeMovie(), director: saved_director_3_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 95)
                            all_saved.push(save_interface.save(4, {
                                movie: util.fakeMovie(), director: saved_director_4_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 94)
                            all_saved.push(save_interface.save(4, {
                                movie: util.fakeMovie(), director: saved_director_5_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 93)
                            all_saved.push(save_interface.save(4, {
                                movie: util.fakeMovie(), director: saved_director_6_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 89)
                            all_saved.push(save_interface.save(4, {
                                movie: util.fakeMovie(), director: saved_director_10_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        all_saved.push(save_interface.save(4, {
                            movie: util.fakeMovie(), director: saved_director_100_movies,
                            actor: saved_actor, genre: util.fakeGenre()
                        }));

                    }
                    q.all(all_saved).then(() => done())
                })

            });

        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 directors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor.movies;

            query_interface.top_5_directors_of_an_actor(4, saved_actor, (err, directors) => {
                if(err) throw err;

                console.log(directors);

                directors.length.should.be.eql(5);
                directors[0].id.should.be.eql(''+saved_director_100_movies.first_name+saved_director_100_movies.last_name);
                directors[1].id.should.be.eql(''+saved_director_10_movies.first_name+saved_director_10_movies.last_name);
                directors[2].id.should.be.eql(''+saved_director_6_movies.first_name+saved_director_6_movies.last_name);
                directors[3].id.should.be.eql(''+saved_director_5_movies.first_name+saved_director_5_movies.last_name);
                directors[4].id.should.be.eql(''+saved_director_4_movies.first_name+saved_director_4_movies.last_name);
                done();
            });


        });
    })

    describe('Version 5', function () {

        var saved_actor;
        var saved_genre;
        var saved_director_1_movies;
        var saved_director_2_movies;
        var saved_director_3_movies;
        var saved_director_4_movies;
        var saved_director_5_movies;
        var saved_director_6_movies;
        var saved_director_10_movies;
        var saved_director_100_movies;

        before('Populate database', function (done) {

            saved_director_1_movies = util.fakeActor();
            saved_director_2_movies = util.fakeActor();
            saved_director_3_movies = util.fakeActor();
            saved_director_4_movies = util.fakeActor();
            saved_director_5_movies = util.fakeActor();
            saved_director_6_movies = util.fakeActor();
            saved_director_10_movies = util.fakeActor();
            saved_director_100_movies = util.fakeActor();

            saved_actor = util.fakeActor();

            saved_genre = util.fakeGenre();



            let all_saved = [];

            save_interface.save(5, {
                movie: util.fakeMovie(), director: saved_director_1_movies,
                actor: saved_actor, genre: util.fakeGenre()
            }).then( () => {

                all_saved.push(save_interface.save(5, {
                    movie: util.fakeMovie(), director: saved_director_2_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(5, {
                    movie: util.fakeMovie(), director: saved_director_3_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(5, {
                    movie: util.fakeMovie(), director: saved_director_4_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(5, {
                    movie: util.fakeMovie(), director: saved_director_5_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(5, {
                    movie: util.fakeMovie(), director: saved_director_6_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(5, {
                    movie: util.fakeMovie(), director: saved_director_100_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(3, {
                    movie: util.fakeMovie(), director: saved_director_10_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                            all_saved.push(save_interface.save(5, {
                                movie: util.fakeMovie(), director: saved_director_2_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 96)
                            all_saved.push(save_interface.save(5, {
                                movie: util.fakeMovie(), director: saved_director_3_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 95)
                            all_saved.push(save_interface.save(5, {
                                movie: util.fakeMovie(), director: saved_director_4_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 94)
                            all_saved.push(save_interface.save(5, {
                                movie: util.fakeMovie(), director: saved_director_5_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 93)
                            all_saved.push(save_interface.save(5, {
                                movie: util.fakeMovie(), director: saved_director_6_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 89)
                            all_saved.push(save_interface.save(5, {
                                movie: util.fakeMovie(), director: saved_director_10_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        all_saved.push(save_interface.save(5, {
                            movie: util.fakeMovie(), director: saved_director_100_movies,
                            actor: saved_actor, genre: util.fakeGenre()
                        }));

                    }
                    q.all(all_saved).then(() => done())
                })

            });

        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 directors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor.movies;

            query_interface.top_5_directors_of_an_actor(5, saved_actor, (err, directors) => {
                if(err) throw err;

                console.log(directors);

                directors.length.should.be.eql(5);
                directors[0].id.should.be.eql(''+saved_director_100_movies.first_name+saved_director_100_movies.last_name);
                directors[1].id.should.be.eql(''+saved_director_10_movies.first_name+saved_director_10_movies.last_name);
                directors[2].id.should.be.eql(''+saved_director_6_movies.first_name+saved_director_6_movies.last_name);
                directors[3].id.should.be.eql(''+saved_director_5_movies.first_name+saved_director_5_movies.last_name);
                directors[4].id.should.be.eql(''+saved_director_4_movies.first_name+saved_director_4_movies.last_name);
                done();
            });


        });
    })

    describe('Version 6', function () {

        var saved_actor;
        var saved_genre;
        var saved_director_1_movies;
        var saved_director_2_movies;
        var saved_director_3_movies;
        var saved_director_4_movies;
        var saved_director_5_movies;
        var saved_director_6_movies;
        var saved_director_10_movies;
        var saved_director_100_movies;

        before('Populate database', function (done) {

            saved_director_1_movies = util.fakeActor();
            saved_director_2_movies = util.fakeActor();
            saved_director_3_movies = util.fakeActor();
            saved_director_4_movies = util.fakeActor();
            saved_director_5_movies = util.fakeActor();
            saved_director_6_movies = util.fakeActor();
            saved_director_10_movies = util.fakeActor();
            saved_director_100_movies = util.fakeActor();

            saved_actor = util.fakeActor();

            saved_genre = util.fakeGenre();



            let all_saved = [];

            save_interface.save(6, {
                movie: util.fakeMovie(), director: saved_director_1_movies,
                actor: saved_actor, genre: util.fakeGenre()
            }).then( () => {

                all_saved.push(save_interface.save(6, {
                    movie: util.fakeMovie(), director: saved_director_2_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(6, {
                    movie: util.fakeMovie(), director: saved_director_3_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(6, {
                    movie: util.fakeMovie(), director: saved_director_4_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(6, {
                    movie: util.fakeMovie(), director: saved_director_5_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(6, {
                    movie: util.fakeMovie(), director: saved_director_6_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(6, {
                    movie: util.fakeMovie(), director: saved_director_100_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                all_saved.push(save_interface.save(6, {
                    movie: util.fakeMovie(), director: saved_director_10_movies,
                    actor: saved_actor, genre: util.fakeGenre()
                }));

                q.all(all_saved).then( () => {
                    all_saved = [];
                    for(let i=0; i< 99; i++) {
                        if (i > 97)
                            all_saved.push(save_interface.save(6, {
                                movie: util.fakeMovie(), director: saved_director_2_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 96)
                            all_saved.push(save_interface.save(6, {
                                movie: util.fakeMovie(), director: saved_director_3_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 95)
                            all_saved.push(save_interface.save(6, {
                                movie: util.fakeMovie(), director: saved_director_4_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 94)
                            all_saved.push(save_interface.save(6, {
                                movie: util.fakeMovie(), director: saved_director_5_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 93)
                            all_saved.push(save_interface.save(6, {
                                movie: util.fakeMovie(), director: saved_director_6_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        if (i > 89)
                            all_saved.push(save_interface.save(6, {
                                movie: util.fakeMovie(), director: saved_director_10_movies,
                                actor: saved_actor, genre: util.fakeGenre()
                            }));
                        all_saved.push(save_interface.save(6, {
                            movie: util.fakeMovie(), director: saved_director_100_movies,
                            actor: saved_actor, genre: util.fakeGenre()
                        }));

                    }
                    q.all(all_saved).then(() => done())
                })

            });

        });

        after('Clear database', function (done) {
            mongoose.connection.db.dropDatabase(function () {
                done();
            })
        });

        it('Retrieves right top 5 directors', function (done) {

            // util.fakeDirector() adds 'movies' field to Director object, used for relationships.
            // Version 0 model does not have relationships, only embedded documents.
            // So we delete the field
            delete saved_actor.movies;

            query_interface.top_5_directors_of_an_actor(6, saved_actor, (err, directors) => {
                if(err) throw err;

                console.log(directors);

                directors.length.should.be.eql(5);
                directors[0].id.should.be.eql(''+saved_director_100_movies.first_name+saved_director_100_movies.last_name);
                directors[1].id.should.be.eql(''+saved_director_10_movies.first_name+saved_director_10_movies.last_name);
                directors[2].id.should.be.eql(''+saved_director_6_movies.first_name+saved_director_6_movies.last_name);
                directors[3].id.should.be.eql(''+saved_director_5_movies.first_name+saved_director_5_movies.last_name);
                directors[4].id.should.be.eql(''+saved_director_4_movies.first_name+saved_director_4_movies.last_name);
                done();
            });


        });
    })
});
