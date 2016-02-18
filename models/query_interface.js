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
                console.log(`query: Movie${version}.find({actors : {$elemMatch : ${JSON.stringify(actor)} } } )`);
                var t1 = process.hrtime();
              /*  mongoose.model('Movie' + version)
                    .find({actors: {$elemMatch: actor}}).populate('directors').then(
                    (movies) => cb(undefined, movies,process.hrtime(t1)[0] + " s, " + process.hrtime(t1)[0] + " ns"));*/
                mongoose.model('Movie' + version)
                    .find({actors: actor}).populate('directors').then(
                    (movies) => cb(undefined, movies,process.hrtime(t1)[0] + " s, " + process.hrtime(t1)[1] + " ns"));
                break;
            case 1:
            case 2:
            case 6:
                var t2 = process.hrtime();
                //query = mongoose.model('Actor' + version).find(actor, 'movies').populate('movies ');

                query = mongoose.model('Actor' + version).find({first_name: actor}, 'movies').populate('movies ');
                console.log(`query: Actor${version}.find(${JSON.stringify(query._conditions)})`);

                let population = {};
                if(version === 2) population = 'actors directors';
                else if( version === 1) population = 'actors';
                else if( version === 6) population = 'actors genres directors';

                query.exec((err, docs) => {
                    if (err) throw err;
                    if (!docs.length)  return cb(new Error('Unable to find actor'), {},process.hrtime(t2)[0] + " s, " + process.hrtime(t2)[1] + " ns");
                    //console.log(`madonna: ${docs}`);
                    docs.forEach ( (doc) => {
                        //console.log('processing movies: ' + JSON.stringify(doc.movies,null,2));
                       // console.log('madonna1');
                        mongoose.model('Movie' + version).populate(doc.movies, population, (err, movies) => {
                            if(err) throw err;
                            //console.log('Populated');
                           // console.log(JSON.stringify(actor, null, 2));
                            if (actor === null)
                                return cb('Error: query returned null');
                            return cb(undefined, movies,process.hrtime(t2)[0] + " s, " + process.hrtime(t2)[1] + " ns");
                        })
                        });
                    });

                break;
        }
        //return result;
    },

    //Tutti i film di un regista
    all_films_one_director: function (version, director, cb) {
        if (isNaN(version) || (!director))
            throw new Error('version and director needed')

        let query;
        switch (version) {
            case 4:
            case 1:
            case 0:
                //console.log(`query: Movie${version}.find({director : {$elemMatch : ${JSON.stringify(director)} } } )`);
                mongoose.model('Movie' + version)
                    .find({directors: {$elemMatch: director}}).populate('actors').then((movies) => cb(undefined, movies));
                break;
            case 3:
            case 2:
            case 6:
            case 5:
                query = mongoose.model('Director' + version).find(director, 'movies').populate('movies ');
                //console.log(`query: Director${version}.find(${JSON.stringify(query._conditions)})`);

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
        //console.log(`movie: ${JSON.stringify(movies[i])}`)
    },
    top_5_actors_of_a_director: function (version, director, cb) {
        function getSorted (films) {
            var top5 = [films[0]];
            for(let i=1; i < films.length; i++)
            {
                //console.log(`elem.id = ${JSON.stringify(films[i].id)}`);
                //console.log(`top5 = ${JSON.stringify(top5)}`);
                insertSorted(films[i],top5);
            }

            return top5;
        }


        function insertSorted(elem, array1) {
            let inserted = false;
            for(let i=0; i < array1.length && (!inserted); i++) {
                if(array1[i].count <= elem.count) {
                    array1.splice(i,0,elem);
                    inserted = true;
                }
            }
            if(!inserted)
                array1.push(elem);
        }

        this.all_films_one_director( version, director, function (err,movies) {
            if(err) cb(err);
            if(!movies) cb(new Error('Director not film'));

           /* console.log(movies);
            console.log(`Found ${movies.length} movies`);*/

            var counted = [], indexes = {}, current_movie, current_actor, position, current_actor_identifier;
            for(let i=0; i < movies.length; i++) {
                current_movie = movies[i];

                for( let j=0; j < current_movie.actors.length; j++) {
                    current_actor = current_movie.actors[j];
                    current_actor_identifier = '' + current_actor.first_name + current_actor.last_name;
                    position = indexes[current_actor_identifier];

                    if (position===undefined) {
                        counted.push({id: current_actor_identifier, count: 1});
                        indexes[current_actor_identifier] = counted.length - 1;
                    }
                    else counted[position].count++;
                }
            }

            let sorted = getSorted(counted).slice(0,5);
            cb(null, sorted);
        })

    },
    top_5_directors_of_an_actor: function (version, actor, cb) {

        function getSorted (films) {
            var top5 = [films[0]];
            for(let i=1; i < films.length; i++)
            {
               // console.log(`elem.id = ${JSON.stringify(films[i].id)}`);
                //console.log(`top5 = ${JSON.stringify(top5)}`);
                insertSorted(films[i],top5);
            }

            return top5;
        }

        function insertSorted(elem, array1) {
            let inserted = false;
            for(let i=0; i < array1.length && (!inserted); i++) {
                if(array1[i].count <= elem.count) {
                    array1.splice(i,0,elem);
                    inserted = true;
                }
            }
            if(!inserted)
                array1.push(elem);
        }

        this.all_films_one_actor( version, actor, function (err,movies) {
            if(err) cb(err);
            if(!movies) return cb(new Error('Actor not film'));

             //console.log(movies);
             //console.log(`Found ${movies.length} movies`);

            var counted = [], indexes = {}, current_movie, current_directors, position, current_director_identifier;
            for(let i=0; i < movies.length; i++) {
                current_movie = movies[i];

                for( let j=0; j < current_movie.actors.length; j++) {
                    current_directors = current_movie.directors[j];
                    current_director_identifier = '' + current_directors.first_name + current_directors.last_name;
                    position = indexes[current_director_identifier];

                    if (position === undefined) {
                        counted.push({id: current_director_identifier, count: 1});
                        indexes[current_director_identifier] = counted.length - 1;
                    }
                    else counted[position].count++;
                }
            }

            let sorted = getSorted(counted).slice(0,5);
            cb(null, sorted);
        })

    }
};
