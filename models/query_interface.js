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

        let query;
        switch (version) {
            case 3:
            case 4:
            case 5:
            case 0:
               // console.log(`query: Movie${version}.find({actors : {$elemMatch : ${JSON.stringify(actor)} } } )`);
                mongoose.model('Movie' + version)
                    .find({actors: {$elemMatch: actor}}).then((movies) => cb(undefined, movies));
                break;
            case 1:
            case 2:
            case 6:
               // query = mongoose.model('Actor' + version).find(actor, 'movies').populate('movies ');
                console.log(`query: Actor${version}.find(${JSON.stringify(query._conditions)})`);

                let population = {};
                if(version === 2) population = 'actors directors';
                else if( version === 1) population = 'actors';
                else if( version === 6) population = 'actors genres directors';

                query.exec((err, docs) => {
                    if (err) throw err;

                    docs.forEach ( (doc) => {
                        //console.log('processing movies: ' + JSON.stringify(doc.movies,null,2));

                        mongoose.model('Movie' + version).populate(doc.movies, population, (err, movies) => {
                            if(err) throw err;
                            //console.log('Populated');
                           // console.log(JSON.stringify(actor, null, 2));
                            if (actor === null)
                                return cb('Error: query returned null');
                            return cb(undefined, movies);
                        })
                        });
                    });

                break;
        }
        //return result;
    },

    all_films_one_director: function (version, director, cb) {
        if (isNaN(version) || (!director))
            throw new Error('version and director needed')

        let query;
        switch (version) {
            case 4:
            case 1:
            case 0:
                console.log(`query: Movie${version}.find({director : {$elemMatch : ${JSON.stringify(director)} } } )`);
                mongoose.model('Movie' + version)
                    .find({directors: {$elemMatch: director}}).then((movies) => cb(undefined, movies));
                break;
            case 3:
            case 2:
            case 6:
            case 5:
                query = mongoose.model('Director' + version).find(director, 'movies').populate('movies ');
                console.log(`query: Director${version}.find(${JSON.stringify(query._conditions)})`);

                let population = {};
                if(version === 2) population = 'directors actors';
                else if( version === 3) population = 'directors';
                else if( version === 5) population = 'directors genres';
                else if( version === 6) population = 'directors genres actors';

                query.exec((err, directors) => {
                    if (err) throw err;

                    directors.forEach ( (director) => {
                        //console.log('processing movies: ' + JSON.stringify(doc.movies,null,2));

                        mongoose.model('Movie' + version).populate(director.movies, population, (err, movies) => {
                            if(err) throw err;
                            //console.log('Populated');
                            // console.log(JSON.stringify(actor, null, 2));
                            if (movies === null)
                                return cb('Error: query returned null');
                            return cb(undefined, movies);
                        })
                    });
                });

                break;
        }
        //return result;
    },
    top_5_actors_of_a_director: function (version, director, cb) {
        this.all_films_one_director( version, director, function (err,movies) {
            let counter = {};
            let sorted_ids = [];
            for(let i=0; i < movies.length; i++) {
                for( let j=0; j < movies.actors.length; j++) {
                    let actor_id = movies.actors[j]._id;
                    counter[actor_id] = ( counter[actor_id] + 1) || 1;
                }
            }
            for (let id in counter) if(counter.hasOwnProperty(id)) {
                let counter[id] = number_of_movies
            }

        })

    },
    top_5_directors_of_an_actor: function (version, actor, cb) {



    }
};
