/**
 * Created by ugo on 13/11/15.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    q = require('q');

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
                console.log(`query: Movie${version}.find({actors :${JSON.stringify(actor)}  } )`);
                var t1 = process.hrtime();
              /*  mongoose.model('Movie' + version)
                    .find({actors: {$elemMatch: actor}}).populate('directors').then(
                    (movies) => cb(undefined, movies,process.hrtime(t1)[0] + " s, " + process.hrtime(t1)[0] + " ns"));
                mongoose.model('Movie' + version)
                    .find({actors: actor}).populate('directors').then(
                    (movies,err) =>
                        cb(undefined, movies,process.hrtime(t1)[0] + " s, " + process.hrtime(t1)[1] + " ns"));*/
                mongoose.model('Movie' + version)
                    .find({actors: actor}).then(
                    (movies,err) =>
                        cb(undefined, movies,process.hrtime(t1)));
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

                    var deferreds = new Array(docs.length);
                    deferreds.fill(1);
                    deferreds = deferreds.map( (x) => q.defer())
                    var promises = new Array(docs.length);
                    promises.fill(1);
                    var pro = promises.map( (x,i) => deferreds[i].promise);

                    docs.forEach ( (doc) => {
                        //console.log('processing movies: ' + JSON.stringify(doc.movies,null,2));
                       // console.log('madonna1');
                        mongoose.model('Movie' + version).populate(doc.movies, population, (err, movies) => {
                            if(err) throw err;
                            //console.log('Populated');
                           // console.log(JSON.stringify(actor, null, 2));
                            if (actor === null)
                                return cb('Error: query returned null');
                            deferreds.pop().resolve(movies);
                           // return cb(undefined, movies,);
                        })
                        });

                    q.all(pro).then(function () {

                      /*  console.log('Finiti tutti. Risultati: ' + arguments.length)
                        console.log(arguments);
                        console.log(arguments[`0`])*/
                        var elapsed_time = process.hrtime(t2);
                        var result = [];
                        arguments[`${0}`].forEach( function (movie) {result.push(movie)});
                       // console.log(result);
                        cb(undefined, result,elapsed_time);
                    })

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
                var t1 = process.hrtime();
                //console.log(`query: Movie${version}.find({director : {$elemMatch : ${JSON.stringify(director)} } } )`);
               /* mongoose.model('Movie' + version)
                    .find({directors: director}).populate('actors').then((movies) => cb(undefined, movies));*/
                mongoose.model('Movie' + version)
                    .find({directors: director}).then((movies,err) =>
                    cb(undefined, movies,process.hrtime(t1)));
                break;
            case 3:
            case 2:
            case 6:
            case 5:
                var t2 = process.hrtime();
                query = mongoose.model('Director' + version).find({first_name: director}, 'movies').populate('movies ');
                //console.log(`query: Director${version}.find(${JSON.stringify(query._conditions)})`);

                let population = {};
                if(version === 2) population = 'directors actors';
                else if( version === 3) population = 'directors';
                else if( version === 5) population = 'directors genres';
                else if( version === 6) population = 'directors genres actors';

                query.exec((err, directors) => {
                    if (err) throw err;


                    var deferreds = new Array(directors.length);
                    deferreds.fill(1);
                    deferreds = deferreds.map( (x) => q.defer())
                    var promises = new Array(directors.length);
                    promises.fill(1);
                    var pro = promises.map( (x,i) => deferreds[i].promise);


                    directors.forEach ( (director) => {
                        //console.log('processing movies: ' + JSON.stringify(doc.movies,null,2));

                        mongoose.model('Movie' + version).populate(director.movies, population, (err, movies) => {
                            if(err) throw err;
                            //console.log('Populated');
                            // console.log(JSON.stringify(actor, null, 2));
                            if (movies === null)
                                return cb('Error: query returned null');
                            deferreds.pop().resolve(movies);
                        })
                    });

                    q.all(pro).then(function () {

                        /*  console.log('Finiti tutti. Risultati: ' + arguments.length)
                         console.log(arguments);
                         console.log(arguments[`0`])*/
                        var elapsed_time = process.hrtime(t2);
                        var result = [];
                        arguments[`${0}`].forEach( function (movie) {result.push(movie)});
                        // console.log(result);
                        cb(undefined, result,elapsed_time);
                    })

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

        this.all_films_one_director( version, director, function (err,movies,time) {
            var time_current = process.hrtime(time);
            if(err) cb(err);
            if(!movies) cb(new Error('Director not film'));

            console.log(version + ' Qua sto')
            if(version===2) console.log(movies);
           // console.log(`Found ${movies.length} movies`);

            var counted = [], indexes = {}, current_movie, current_actor, position, current_actor_identifier;
            for(let i=0; i < movies.length; i++) {
                if( (version === 2) || (version === 3) || (version === 5) || (version === 6) )
                    current_movie = movies[i][0];
                else  current_movie = movies[i];
              /*  if(version === 2) console.log(current_movie)
                if(version === 2) console.log(version + ' Qua sdsssssssdddto')
                if(version === 2) console.log(version + ' Qua sdssssssd == ' + current_movie.actors)*/
                for( let j=0; j < current_movie.actors.length; j++) {
                  //  console.log('In ciclo ' + j)
                    current_actor = current_movie.actors[j];
                    current_actor_identifier = '' + current_actor.first_name + current_actor.last_name;
                    position = indexes[current_actor_identifier];
                    if(version === 2) console.log(version + ' Qua 1111sdsssssssdddto')
                    if (position===undefined) {
                        counted.push({id: current_actor_identifier, count: 1});
                        indexes[current_actor_identifier] = counted.length - 1;
                    }
                    else counted[position].count++;
                }
               // console.log('fuori dal ciclo')
            }
            console.log(version + ' Qua sddddto')
            let sorted = getSorted(counted).slice(0,5);
            console.log(sorted);
            cb(null, sorted,process.hrtime(time_current));
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

        this.all_films_one_actor( version, actor, function (err,movies,time) {
            console.log(time);
            console.log(time);
            var currentime = process.hrtime(time);
            if(err) cb(err);
            if(!movies) return cb(new Error('Actor not film'));
           // if(version===1) console.log(movies);
             //console.log(`Found ${movies.length} movies`);

            var counted = [], indexes = {}, current_movie, current_directors, position, current_director_identifier;
            for(let i=0; i < movies.length; i++) {
               // console.log('nel ciclo ' + i)
                if((version===1) || (version === 2) || (version===6)) current_movie = movies[i][0];
                else current_movie = movies[i];
                for( let j=0; j < current_movie.actors.length; j++) {
                   // console.log('nel miniciclo');
                    current_directors = current_movie.directors[j];
                    if(!current_directors) continue;
                  //  console.log('che non me lo vedo')
                    //
                    current_director_identifier = '' + (current_directors.first_name || 'John');
                   // console.log('checcccc non me lo vedo')
             //
                    position = indexes[current_director_identifier];
                   // console.log('dsdsdsds')
                    if (position === undefined) {
                       // console.log('position unefined');
                        counted.push({id: current_director_identifier, count: 1});
                        indexes[current_director_identifier] = counted.length - 1;
                    }
                    else {
                       // console.log('else')
                        counted[position].count++;
                    }
                }
              /*  console.log('afori dal ciclo')
                console.log(movies.length)
                console.log(i)*/
            }
           // console.log('Ma')
            let sorted = getSorted(counted).slice(0,5);
            //console.log(sorted);
            cb(null, sorted,process.hrtime(currentime));
        })

    }
};
