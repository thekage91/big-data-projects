/*
 Movie structure:

 movie id | movie title | release date | video release date |
 IMDb URL | unknown | Action | Adventure | Animation |
 Children's | Comedy | Crime | Documentary | Drama | Fantasy |
 Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
 Thriller | War | Western |
 */

 'use strict';

var fs = require('fs'),
    parse = require('csv-parse'),

    moviesPath = './dataset/movies.list',
    directorsPath = './dataset/directors.list',
    genresPath = './dataset/genres.list',
    actorsPath = './dataset/actors.list',

    moviesPathShort = './dataset/movies.short.list',
    genresPathShort = './dataset/genres.short.list',
    directorsPathShort = './dataset/directors.short.list',
    actorsPathShort = './dataset/actors.short.list',

    app = require('./app.js'),
    mongoose = app.mongoose;

var movieParser = require('./parsers/parser.movies.js'),
    directorParser = require('./parsers/parser.directors.js'),
    actorsParser = require('./parsers/parser.actors.js'),
    genresParser = require('./parsers/parser.genres.js');
 
 // da togliere
 var moviePostApi = "/api/film"
 var genrePostApi = "/api/genre"
 var directorPostApi = "/api/director"
 var actorPostApi = "/api/actor"

 var genres = {},
     actors = {};

var Saver = require("./saver/saver.js");

 var callbackSave = function (err) {
    if (err) throw new Error(err);
    console.log('Succesfully saved')
}

/* 
*   Return genres json --> { genre: movies_array }
*/ 
var parseGenres = parse({ delimiter: '\t', relax: true}, function(err, data){

    if(err){
        console.error(err);
        return;
    }

    var i = 0;

    data.forEach(function (elem){

        if(genres[elem[elem.length - 1]] === undefined ){

            genres[elem[elem.length - 1]] = [];
        }

        genres[elem[elem.length - 1]].push(regexMovie(elem[0]));
    });
});

parseGenres.on('finish', function(){

    console.log("[DEBUG] Genres: " + genres);
});

//parseGenres.end();

var parseActors = parse({ delimiter: '\n', relax: true }, function(err, data){

    if(err){
        console.error(err);
        return;
    }

    /* 
    * actors: { nomeAttore: arrayFilms }
    */ 
    var currentRecord = [],
    currentActor = "";

    data.forEach(function(elem){

        if( elem[0].indexOf('\t') !== 0 ){

            currentRecord = elem[0].split(',')[1].replace(' ', '').split('\t');
            currentActor = currentRecord[0];
            actors[currentActor] = [ currentRecord[currentRecord.length - 1].replace('"', '') ];
        }
        else{

            var movie = elem[0].replace('\t', '');

            actors[currentActor].push(movie);
        }
    })
})

parseActors.on('finish', function(){

    console.log("\n[DEBUG] Acotors: " + actors);
})




var parseAndSave= function () {

    console.log("[DEBUG] Start | movies | actors | directors | genres |  parsing...")

    let _movies = [];
    var moviesStream = fs.createReadStream(moviesPath).pipe(movieParser.startParsing);

    console.log("\n\nParsing Genres");
    var genresStream = fs.createReadStream(genresPath).pipe(genresParser.startParsing);
    
    console.log("\n\nParsing Acotors");
    var actorsStream = fs.createReadStream(actorsPath).pipe(actorsParser.startParsing);
    
    console.log("\n\nParsing Directors");
    var directorsStream = fs.createReadStream(directorsPath).pipe(directorParser.startParsing);

    movieParser.movies.then(function(movies){

        Saver.Movies = movies;

    }).then(function(){

        directorParser.directors.then(function(directors){
        
            Saver.Directors = directors;

        }).then(function(){

            genresParser.genres.then(function(genres){
            
                Saver.Genres = genres;

            }).then(function(){

                actorsParser.actors.then(function(actors){

                    Saver.Actors = actors;

                }).then(function(){

                    console.log("Actors: " + Object.keys(Saver.Actors).length);

                    console.log("Genres: " + Object.keys(Saver.Genres).length);
                    
                    console.log("Directors: " + Object.keys(Saver.Directors).length);

                    console.log("Movies: " + Object.keys(Saver.Movies).length);
                    //Saver.saveM();
                    //Saver.saveMA();
                    /*Saver.saveMAD();
                    Saver.saveMD();
                    Saver.saveMG();
                    Saver.saveMGD();
                    Saver.saveMGDA();*/
                });
            })
        });
    });

    console.log("[DEBUG] Finish parsing...")
    console.log("[DEBUG] Start save schema on DB... ")

}

module.exports = {

    parsingDataAndSave: parseAndSave
}

parseAndSave();

