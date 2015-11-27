/**
 * Created by ugo on 13/11/15.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = {

    // Tutti i film di un attore
    all_films_one_actor: function (version, actor, cb) {
        if (isNaN(version) || actor == undefined)
            throw new Error('version and actor needed')

        let query = new mongoose.Query();
        switch (version) {
            case 3:
            case 4:
            case 5:
            case 0:
                console.log(`query: Movie${version}.find({actors : {$elemMatch : ${JSON.stringify(actor)} } } )`);
                mongoose.model('Movie' + version)
                    .find({actors: {$elemMatch: actor}}).then((movies) => cb(undefined, movies));
                break;
            case 1:
            case 2:
            case 6:

                if(version === 2)
                    query = mongoose.model('Actor' + version).find(actor, 'movies').populate('movies movies.directors');
                else if(version === 1)
                    query = mongoose.model('Actor' + version).find(actor, 'movies').populate('movies');
                else if(version === 6)
                    query = mongoose.model('Actor' + version).find(actor, 'movies').populate('movies  movies.directors  movies.directors  movies.genres');

                console.log(`query: Actor${version}.find(${JSON.stringify(query._conditions)})`);

                query.exec((err, actors) => {
                        if (err) throw err;
                        if(actors === undefined)
                            return cb('Error: query returned undefined');
                        var movies = [];
                        for (let i = 0; i < actors.length; i++)
                            movies = movies.concat(actors[i].movies);
                        return cb(undefined, movies);
                    });

                break;
        }
        //return result;
    }
};
