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
    Actor2 = mongoose.model('Actor2'),
    Movie3 = mongoose.model('Movie3'),
    Director3 = mongoose.model('Director3'),
    Genre4 = mongoose.model('Genre4'),
    Movie4 = mongoose.model('Movie4'),
    Genre5 = mongoose.model('Genre5'),
    Movie5 = mongoose.model('Movie5'),
    Director5 = mongoose.model('Director5'),
    Genre6 = mongoose.model('Genre6'),
    Director6 = mongoose.model('Director6'),
    Actor6 = mongoose.model('Actor6'),
    Movie6 = mongoose.model('Movie6');


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
        let genre_to_save = q.defer();

        switch (version) {
            case 0:
                /*
                 movie_to_save = new Movie0(data.movie);
                 movie_to_save.save(function (err, movie) {
                 if (err) result.reject(err);
                 result.resolve(movie);
                 });
                 */
                Movie0.findOne({title: data.movie.title}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                    else (new Movie0(data.movie)).save((err,movie) => {
                        console.log('calcola che è nuovo')
                        if(err) throw new Error(err);
                        console.log('salvato:')
                        console.log(movie)
                        movie_to_save.resolve(movie);
                    });
                });

                movie_to_save.promise.then((movie) => {

                    // Model fields are plural, function argument not.
                    // In order to update model, we first pluralize field names.
                    let update = {};

                    if(data.genre ) update.genres = data.genre;
                    if(data.actor ) update.actors = data.actor;
                    if(data.director ) update.directors = data.director;

                   /* if( update.genres === undefined &&
                        update.actors === undefined &&
                        update.directors === undefined)
                    {
                        console.log('no aggiornamento')
                        result.resolve(movie);
                    }*/
                   // else {
                        console.log(`query: { $push : ${JSON.stringify(update)} }`)
                        Movie0.findByIdAndUpdate(movie._id, {$push: update}, {new: true},
                            (err, movie) => {
                                if (err) throw new Error(err);
                                result.resolve(movie);
                            });
                   // }
                })
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

                Movie4.findOne({title: data.movie.title}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                    else (new Movie4(data.movie)).save((err,movie) => {
                        if(err) throw new Error(err);
                        movie_to_save.resolve(movie);
                    });
                });

                Genre4.findOne({name: data.genre.name}, function (err, retrieved_genre) {
                    if (err) result.reject(err);
                    if (typeof retrieved_genre !== 'undefined' && retrieved_genre)
                        genre_to_save.resolve(retrieved_genre)
                    else (new Genre4(data.genre)).save((err,genre) => {
                        if(err) throw new Error(err);
                        genre_to_save.resolve(genre);
                    });
                });


                q.all([movie_to_save.promise,genre_to_save.promise]).then(function (data) {
                    let movie = data[0];
                    let genre = data[1];

                    let movie_promise = q.defer();
                    let genre_promise = q.defer();


                    Movie4.findByIdAndUpdate(movie._id, {$push : {genres: genre._id} }, {new: true},
                        (err,movie) => {
                            if(err) throw new Error(err);
                            movie_promise.resolve(movie);
                        });

                    Genre4.findByIdAndUpdate(genre._id, {$push : { movies: movie._id} }, {new: true},
                        (err,genre) => {
                            if(err) throw new Error(err);
                            genre_promise.resolve(genre);
                        });

                    q.all([movie_promise.promise, genre_promise.promise]).then( (mov_gen) => {
                        result.resolve(mov_gen);
                    });

                })
                break;
            case 5:


                Movie5.findOne({title: data.movie.title}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                    else (new Movie5(data.movie)).save((err,movie) => {
                        if(err) throw new Error(err);
                        movie_to_save.resolve(movie);
                    });
                });

                Genre5.findOne({name: data.genre.name}, function (err, retrieved_genre) {
                    if (err) result.reject(err);
                    if (typeof retrieved_genre !== 'undefined' && retrieved_genre)
                        genre_to_save.resolve(retrieved_genre)
                    else (new Genre5(data.genre)).save((err,genre) => {
                        if(err) throw new Error(err);
                        genre_to_save.resolve(genre);
                    });
                });

                Director5.findOne({
                    last_name: data.director.last_name,
                    first_name: data.director.first_name
                }, function (err, retrieved_director) {
                    if (err) result.reject(err);
                    if (typeof retrieved_director !== 'undefined' && retrieved_director)
                        director_to_save.resolve(retrieved_director)
                    else (new Director5(data.director)).save((err,genre) => {
                        if(err) throw new Error(err);
                        director_to_save.resolve(genre);
                    });
                });


                q.all([movie_to_save.promise, genre_to_save.promise, director_to_save.promise]).then(function (data) {
                    let movie = data[0];
                    let genre = data[1];
                    let director = data[2];

                    let movie_promise = q.defer();
                    let genre_promise = q.defer();
                    let director_promise = q.defer();


                    Movie5.findByIdAndUpdate(movie._id, {$push : { genres: genre._id, directors: director._id} }, {new: true},
                        (err,movie) => {
                            if(err) throw new Error(err);
                            movie_promise.resolve(movie);
                        });

                    Genre5.findByIdAndUpdate(genre._id, {$push : { movies: movie._id} }, {new: true},
                        (err,genre) => {
                            if(err) throw new Error(err);
                            genre_promise.resolve(genre);
                        });
                    Director5.findByIdAndUpdate(director._id, {$push : { movies: movie._id} }, {new: true},
                        (err,director) => {
                            if(err) throw new Error(err);
                            director_promise.resolve(director);
                        });

                    q.all([movie_promise.promise,genre_promise.promise, director_promise.promise]).then( (mov_gen_dir) => {
                        result.resolve(mov_gen_dir);
                    });

                })
                break;
            case 6:

                Movie6.findOne({title: data.movie.title}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                    else (new Movie6(data.movie)).save((err,movie) => {
                        if(err) throw new Error(err);
                        movie_to_save.resolve(movie);
                    });
                });

                Genre6.findOne({name: data.genre.name}, function (err, retrieved_genre) {
                    if (err) result.reject(err);
                    if (typeof retrieved_genre !== 'undefined' && retrieved_genre)
                        genre_to_save.resolve(retrieved_genre)
                    else (new Genre6(data.genre)).save((err,genre) => {
                        if(err) throw new Error(err);
                        genre_to_save.resolve(genre);
                    });
                });

                Director6.findOne({
                    last_name: data.director.last_name,
                    first_name: data.director.first_name
                }, function (err, retrieved_director) {
                    if (err) result.reject(err);
                    if (typeof retrieved_director !== 'undefined' && retrieved_director)
                        director_to_save.resolve(retrieved_director)
                    else (new Director6(data.director)).save((err,director) => {
                        if(err) throw new Error(err);
                        director_to_save.resolve(director);
                    });
                });

                Actor6.findOne({
                    last_name: data.actor.last_name,
                    first_name: data.actor.first_name
                }, function (err, retrieved_actor) {
                    if (err) result.reject(err);
                    if (typeof retrieved_actor !== 'undefined' && retrieved_actor)
                        actor_to_save.resolve(retrieved_actor)
                    else (new Actor6(data.actor)).save((err,actor) => {
                        if(err) throw new Error(err);
                        actor_to_save.resolve(actor);
                    });
                });


                q.all([movie_to_save.promise, genre_to_save.promise, director_to_save.promise,actor_to_save.promise])
                    .then(function (data) {
                        let movie = data[0];
                        let genre = data[1];
                        let director = data[2];
                        let actor = data[3];

                        let movie_promise = q.defer();
                        let genre_promise = q.defer();
                        let director_promise = q.defer();
                        let actor_promise = q.defer();


                        Movie6.findByIdAndUpdate(movie._id, {$push : { genres: genre._id, directors: director._id, actors: actor._id} }, {new: true},
                            (err,movie) => {
                                if(err) throw new Error(err);
                                movie_promise.resolve(movie);
                            });

                        Genre6.findByIdAndUpdate(genre._id, {$push : { movies: movie._id} }, {new: true},
                            (err,genre) => {
                                if(err) throw new Error(err);
                                genre_promise.resolve(genre);
                            });
                        Director6.findByIdAndUpdate(director._id, {$push : { movies: movie._id} }, {new: true},
                            (err,director) => {
                                if(err) throw new Error(err);
                                director_promise.resolve(director);
                            });

                        Actor6.findByIdAndUpdate(actor._id, {$push : { movies: movie._id} }, {new: true},
                            (err,actor) => {
                                if(err) throw new Error(err);
                                actor_promise.resolve(actor);
                            });


                        q.all([movie_promise.promise,genre_promise.promise, director_promise.promise, actor_promise.promise]).then( (mov_gen_dir_act) => {
                            result.resolve(mov_gen_dir_act);
                        });

                    })
                break;
        }
        return result.promise;
    }


}
