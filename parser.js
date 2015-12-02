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
 provaPath = './dataset/prova.list',

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

// da togiere 
 var directorsFields = ['first_name', 'last_name', 'film'];
 var genreFields = ['film', 'genre'];
 var actorFields = ['first_name', 'last_name', 'film', '', '', 'role'];

 var genres = {},
     actors = {};

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

//parseActors.end();

module.exports = {

    parsingDataAndSave: parseAndSave
}

var filter = function(element, obj){

    var result = [];

    for(var key in obj){

        if(obj[key].indexOf(element) !== -1){

            result.push(key);
        }
    }

    return result;
}

/* Schema Movies */
var schemaM = function(){

    var Movie0 = mongoose.model('Movie0');  
    var movieToPost = {};
    
    /*
    *  Populet movies with relations
    */

    console.log("[DEBUG] Save schema Movies...")

    movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        movieToPost.genres = filter(elem, genres);
        movieToPost.actors = filter(elem, actors);
        movieToPost.directors = filter(elem, directors);

        /*Movie0.create(movieToPost, function (err, movie) {
            if (err) throw new Error(err);
            console.log('Saved in database movie with id: ' + movie._id + " and title: " + movie.title);
        });*/


});

    console.log("[DEBUG] Finish...")
};

/* Schema Movies Actors */ 
var schemaMA= function(){

    var Movie0 = mongoose.model('Movie0');  


    
};

/* Schema Movies Actors Directors */
var schemaMAD = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* Schema Movies Directors */ 
var schemaMD = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* Schema Movies Genres */ 
var saveMG = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* Schema Movies Genres Directors */ 
var saveMGD = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* Schema Movies Genres Directors Actors */ 
var saveMGDA = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};


var parseAndSave= function () {

    console.log("[DEBUG] Start | movies | actors | directors | genres |  parsing...")

    var moviesStream = fs.createReadStream(moviesPathShort).pipe(movieParser.startParsing);
    var genresStream = fs.createReadStream(genresPathShort).pipe(genresParser.startParsing);
    var actorsStream = fs.createReadStream(actorsPathShort).pipe(actorsParser.startParsing);
    var directorsStream = fs.createReadStream(directorsPathShort).pipe(directorParser.startParsing);

    movieParser.movies.then(function(movies){
        movies.forEach(function(elem){
        });
    });

    directorParser.directors.then(function(directors){
        var stringDirectors = JSON.stringify(directors);
    })

    genresParser.genres.then(function(genres){

        var stringGenres = JSON.stringify(genres);
    });

    actorsParser.actors.then(function(actors){

        var stringActors = JSON.stringify(actors);
    });

    console.log("[DEBUG] Finish parsing...")
    console.log("[DEBUG] Start save schema on DB... ")

    //schemaM(movies, genres, directors, actors);
}

var log = function(){

    console.log("\n\n[DEBUG] Movies: " + JSON.stringify(films));
    console.log("\n\n[DEBUG] Genres: " + JSON.stringify(genres));
    console.log("\n\n[DEBUG] Actors: " + JSON.stringify(actors));
    console.log("\n\n[DEBUG] Directors: " + JSON.stringify(directors));
}

parseAndSave();

