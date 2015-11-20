/**
 * Created by ugo on 13/11/15.
 */

'use strict';

var mongoose = require('mongoose'),
    q = require('q'),
    Movie0 = mongoose.model('Movie0'),
    Movie1 = mongoose.model('Movie1'),
    Actor1 = mongoose.model('Actor1'),
    Movie2 = mongoose.model('Movie2'),
    Director2 = mongoose.model('Director2'),
    Movie3 = mongoose.model('Movie3'),
    Director3 = mongoose.model('Director3');



module.exports = {

    /**
     * Save a movie and/or other models
     *
     * @param {number} version - Which database model to use (see models folder)
     * @param {object} data.movie - Movie data to save
     * @param {object} [data.actor] - Actor data to save
     * @param {object} [data.director] - Director data to save
     * @param {object} [data.genre] - Genre data to save
     *
     * @return {promise} - Promise either resolved with saved data or rejected with error
     */
    save: function (version, data) {
        let result = q.defer();

        let movie_to_save = q.defer();
        let actor_to_save = q.defer();
        let director_to_save = q.defer();

        switch (version) {
            case 0:
                movie_to_save = new Movie0(data.movie);
                movie_to_save.save(function (err, movie) {
                    if (err) result.reject(err);
                    result.resolve(movie);
                });
                break;
            case 1:

                Movie1.findOne({title: data.movie.title}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                    else (new Movie1(data.movie)).save((err,movie) => {
                        if(err) throw new Error(err);
                        movie_to_save.resolve(movie);
                    });
                });

                Actor1.findOne({
                    last_name: data.actor.last_name,
                    first_name: data.actor.first_name
                }, function (err, retrieved_actor) {
                    if (err) result.reject(err);
                    if (typeof retrieved_actor !== 'undefined' && retrieved_actor)
                        actor_to_save.resolve(retrieved_actor)
                    else (new Actor1(data.actor)).save((err,actor) => {
                        if(err) throw new Error(err);
                        actor_to_save.resolve(actor);
                    });
                });

                q.all([movie_to_save.promise, actor_to_save.promise]).then(function (data) {
                    let movie = data[0];
                    let actor = data[1];

                    let movie_promise = q.defer();
                    let actor_promise = q.defer();

                    movie.actors = movie.actors || [];
                    actor.movies = actor.movies || [];


                    Movie1.findByIdAndUpdate(movie._id, {$push : { actors: actor._id} }, {new: true},
                        (err,movie) => {
                            if(err) throw new Error(err);
                            movie_promise.resolve(movie);
                    });

                    Actor1.findByIdAndUpdate(actor._id, {$push : { movies: movie._id} }, {new: true},
                        (err,actor) => {
                            if(err) throw new Error(err);
                            actor_promise.resolve(actor);
                        });

                    q.all([movie_promise.promise,actor_promise.promise]).then( (mov_act) => {
                        result.resolve(mov_act);
                    });

                })

                break;
            case 2:

                Movie2.findOne({title: data.movie.title}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                    else (new Movie2(data.movie)).save((err,movie) => {
                        if(err) throw new Error(err);
                        movie_to_save.resolve(movie);
                    });
                });

                Actor2.findOne({
                    last_name: data.actor.last_name,
                    first_name: data.actor.first_name
                }, function (err, retrieved_actor) {
                    if (err) result.reject(err);
                    if (typeof retrieved_actor !== 'undefined' && retrieved_actor)
                        actor_to_save.resolve(retrieved_actor)
                    else (new Actor2(data.actor)).save((err,actor) => {
                        if(err) throw new Error(err);
                        actor_to_save.resolve(actor);
                    });
                });

                Director2.findOne({
                    last_name: data.director.last_name,
                    first_name: data.director.first_name
                }, function (err, retrieved_director) {
                    if (err) result.reject(err);
                    if (typeof retrieved_director !== 'undefined' && retrieved_director)
                        director_to_save.resolve(retrieved_director)
                    else (new Director2(data.director)).save((err,actor) => {
                        if(err) throw new Error(err);
                        director_to_save.resolve(actor);
                    });
                });


                q.all([movie_to_save.promise, actor_to_save.promise, director_to_save.promise]).then(function (data) {
                    let movie = data[0];
                    let actor = data[1];
                    let director = data[2];

                    let movie_promise = q.defer();
                    let actor_promise = q.defer();
                    let director_promise = q.defer();


                    Movie2.findByIdAndUpdate(movie._id, {$push : { actors: actor._id, directors: director._id} }, {new: true},
                        (err,movie) => {
                            if(err) throw new Error(err);
                            movie_promise.resolve(movie);
                        });

                    Actor2.findByIdAndUpdate(actor._id, {$push : { movies: movie._id} }, {new: true},
                        (err,actor) => {
                            if(err) throw new Error(err);
                            actor_promise.resolve(actor);
                        });
                    Director2.findByIdAndUpdate(director._id, {$push : { movies: movie._id} }, {new: true},
                        (err,director) => {
                            if(err) throw new Error(err);
                            director_promise.resolve(director);
                        });

                    q.all([movie_promise.promise,actor_promise.promise, director_promise.promise]).then( (mov_act_dir) => {
                        result.resolve(mov_act_dir);
                    });

                })
                break;
            case 3:

                Movie3.findOne({title: data.movie.title}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                    else (new Movie3(data.movie)).save((err,movie) => {
                        if(err) throw new Error(err);
                        movie_to_save.resolve(movie);
                    });
                });

                Director3.findOne({
                    last_name: data.director.last_name,
                    first_name: data.director.first_name
                }, function (err, retrieved_director) {
                    if (err) result.reject(err);
                    if (typeof retrieved_director !== 'undefined' && retrieved_director)
                        director_to_save.resolve(retrieved_director)
                    else (new Director3(data.director)).save((err,actor) => {
                        if(err) throw new Error(err);
                        director_to_save.resolve(actor);
                    });
                });


                q.all([movie_to_save.promise,director_to_save.promise]).then(function (data) {
                    let movie = data[0];
                    let director = data[1];

                    let movie_promise = q.defer();
                    let director_promise = q.defer();


                    Movie3.findByIdAndUpdate(movie._id, {$push : {directors: director._id} }, {new: true},
                        (err,movie) => {
                            if(err) throw new Error(err);
                            movie_promise.resolve(movie);
                        });

                    Director3.findByIdAndUpdate(director._id, {$push : { movies: movie._id} }, {new: true},
                        (err,director) => {
                            if(err) throw new Error(err);
                            director_promise.resolve(director);
                        });

                    q.all([movie_promise.promise, director_promise.promise]).then( (mov_dir) => {
                        result.resolve(mov_dir);
                    });

                })
                break;

            case 4:
            case 5:
            case 6:
                break;
        }
        return result.promise;
    }


}
