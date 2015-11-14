/**
 * Created by ugo on 13/11/15.
 */


/**
 * Created by ugo on 13/11/15.
 */

var mongoose = require('mongoose'),
    q = require('q'),
    Movie0 = mongoose.model('Movie0'),
    Movie1 = mongoose.model('Movie1'),
    Actor1 = mongoose.model('Actor1'),
    Movie0 = mongoose.model('Movie0');



module.exports = {

    /**
     * Save a movie and/or other models
     *
     * @param {number} version - Which database model to use (see models folder)
     * @param {object} data.movie - Movie data to save
     * @param {object} [data.actor] - Actor data to save
     * @param {object} [data.director] - Director data to save
     * @param {object} [data.genre] - Genre data to save
     */
    save: function (version, data) {
        let result = q.defer();
        switch (version) {
            case 0:
                let movie_to_save = new Movie0(data.movie);
                movie_to_save.save(function (err, movie) {
                    if (err) result.reject(err);
                    result.resolve(movie);
                })
                break;
            case 1:
                let movie_to_save = q.defer(), actor_to_save = q.defer();

                Movie1.findOne({name: data.movie.name}, function (err, retrieved_movie) {
                    if (err) result.reject(err);
                    if (typeof retrieved_movie !== 'undefined' && retrieved_movie)
                        movie_to_save.resolve(retrieved_movie)
                });

                Actor1.findOne({
                    last_name: data.actor.last_name,
                    first_name: data.actor.first_name
                }, function (err, retrieved_actor) {
                    if (err) result.reject(err);
                    if (typeof retrieved_actor !== 'undefined' && retrieved_actor)
                        actor_to_save.resolve(retrieved_actor)
                });

                movie_to_save.resolve(new Movie1(data.movie));
                actor_to_save.resolve(new Movie1(data.actor));

                q.all([movie_to_save, actor_to_save]).then(function (movie, actor) {
                    movies.actors = movie.actors || [];
                    actor.movies = actor.movies || [];

                    movie.actors.push(actor._id);
                    actor.movies.push(movies._id);

                    movie.save(() => {
                    });
                    actor.save(() => {
                    });

                })

                movie.save(function (err, movie) {
                    if (err) throw new Error(err);
                });
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;
        }
    }
}
