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

 var movieParser = require('./parsers/parser.movies.js');
 
 var moviePostApi = "/api/film"
 var genrePostApi = "/api/genre"
 var directorPostApi = "/api/director"
 var actorPostApi = "/api/actor"


 var directorsFields = ['first_name', 'last_name', 'film'];
 var genreFields = ['film', 'genre'];
 var actorFields = ['first_name', 'last_name', 'film', '', '', 'role'];

 var genres = {},
     actors = {}, 
     directors = {};

 var callbackSave = function (err) {
    if (err) throw new Error(err);
    console.log('Succesfully saved')
}


var regexMovie = function(title){

    return title.split(" (")[0].replace(/"/g, "");
}

/* 
*   Return array di json di films
*   film json --> { title: "foo", release_date: "33433" }
*/

var films = [];
var temp_title = "";

var parserMovies = parse({delimiter: '\t', relax: true, columns: ['title', 'release_date']});

parserMovies.on('readable', function(){

    var record;
    
    while(record = parserMovies.read()){

        var film = {};    
        //Per ogni riga, filtra via gli elementi vuoti

        film.title = regexMovie(record.title);

        /* 
        * Essendo il film ordinati in maniera crescente, effettuo un controllo del precendete
        * Se il precedente è uguale al corrente allora sto aggiungendo un duplicato, 
        * quindi salto la fase di salvataggio 
        */
        if(temp_title !== film.title){

            var temp_date = record.undefined;

            if(temp_date != undefined && temp_date.includes("-????")){
                film.release_date = temp_date.replace("-????", "");
            }
            else{
                film.release_date = temp_date;
            }

            temp_title = film.title;
            films.push(film);
        }
    }
})

parserMovies.on('finish', function() {

    console.log("[DEBUG] Movies");
    films.forEach(function(elem){ 
        console.log(elem); 
    });
});

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
/* 
*   direcotors json --> { director_name: movies_array }
*/
var parseDirectors = parse({ delimiter: '\n', relax: true }, function (err, data) {

    if (err) {
        console.error(err);
        return;
    }

    var currentRecord = [],
    currentDirector = "";

    data.forEach(function (elem) {

        if( elem[0].indexOf('\t') !== 0 ){

            currentRecord = elem[0].split('\t');
            currentDirector = currentRecord[0].replace(',', '');

            directors[currentDirector] = [ currentRecord[1] ];
        }
        else{

            var movie = elem[0].replace('\t', '');
            directors[currentDirector].push(movie);
        }
    });
});

parseDirectors.on('finish', function(){


    parseActors.end();
    parserMovies.end();
    parseGenres.end();

    console.log("\n\n[DEBUG] fi: " + JSON.stringify(films));

    console.log("\n\n[DEBUG] actors: " + JSON.stringify(actors));
    console.log("\n\n[DEBUG] genres: " + JSON.stringify(genres));
    
})

//parseDirectors.end();


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
    /*var genresStream = fs.createReadStream(genresPathShort).pipe(parseGenres);
    var actorsStream = fs.createReadStream(actorsPathShort).pipe(parseActors);
    var directorsStream = fs.createReadStream(directorsPathShort).pipe(parseDirectors);*/

    console.log("---- " + movieParser.title);
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

