/*
 Movie structure:

 movie id | movie title | release date | video release date |
 IMDb URL | unknown | Action | Adventure | Animation |
 Children's | Comedy | Crime | Documentary | Drama | Fantasy |
 Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
 Thriller | War | Western |
 */

 var fs = require('fs'),
 parse = require('csv-parse'),

 moviesPath = './dataset/movies.list',
 directorsPath = './dataset/directors.list',
 genresPath = './dataset/genres.list',
 actorsPath = './dataset/actors.list',
 provaPath = './dataset/prova.list',

 moviesPathShort = './dataset/movies.short.list',

 app = require('./app.js'),
 mongoose = app.mongoose,

 Actor = mongoose.model('Actor'),
 Director = mongoose.model('Director'),
 Movie = mongoose.model('Movie'),
 Genre = mongoose.model('Genre');


 var moviePostApi = "/api/film"
 var genrePostApi = "/api/genre"
 var directorPostApi = "/api/director"
 var actorPostApi = "/api/actor"


 var directorsFields = ['first_name', 'last_name', 'film'];
 var genreFields = ['film', 'genre'];
 var actorFields = ['first_name', 'last_name', 'film', '', '', 'role'];


 var callbackSave = function (err) {
    if (err) throw new Error(err);
    console.log('Succesfully saved')
}

var parserDirectors = parse({
    delimiter: '\t',
    relax: true,
    columns: ['first_name', 'last_name', 'film']
}, function (err, data) {


    var film;

    if (err) {
        console.error(err);
        return;
    }

    //console.info('INFOFOSDIF ' + JSON.stringify(data));
    data.forEach(function (elem) {
        //Per ogni riga, filtra via gli elementi vuoti
        console.log("[DEBUG] " + data);
        Movie.find({title: elem.film.trim()}, function (err, movies) {
            if (err) throw new Error(err);
            if (movies.length === 0) {
                console.log('No movie with title: ' + elem.film);
                return;
            }
            movies.forEach(function (movie) {
                console.log('adding director to film: ' + elem.film);
                var director = new Director({first_name: elem.first_name, last_name: elem.last_name});
                director.movies.push(movie.id);
                movie.directors.push(director.id);
                director.save(callbackSave);
                movie.save(callbackSave);

            });

        })

    });

});


var parserMovies = parse({delimiter: '\t', relax: true, columns: ['title', 'release_date']}, function (err, data) {

    var films = [];
    var temp_title = "";

    console.log("[DEBUG] Parsing movies");
    if (err) {
        console.error(err);
        return;
    }

    //Per ogni riga, filtra via gli elementi vuoti
    data.forEach(function (elem) {

        var film = {};

        film.title = elem.title.split(" (")[0].replace(/"/g, "");

        /* Essendo il film ordinati in maniera crescente, effettuo un controllo del precendete
        * Se il precedente è uguale al corrente allora sto aggiungendo un duplicato, 
        * quindi salto la fase di salvataggio 
        */
        if(temp_title !== film.title){

            var temp_date = elem.undefined;
    
            if(temp_date != undefined && temp_date.includes("-????")){
                film.release_date = temp_date.replace("-????", "");
            }
            else{
                film.release_date = temp_date;
            }

            Movie.create(film, function (err, movie) {
                if (err) throw new Error(err);
                console.log('Saved in database movie with id: ' + movie._id + " and title: " + movie.title);
            });

            temp_title = film.title;
        }
    });

});




var moviesOutput = [];
var userOutput = [];
var genreOutput = [];
var dataOutput = [];

module.exports = {

    parsingDataAndSave: parseAndSave
}


var parseAndSave = function () {

    console.log("[+] Dropping Database ");

    console.log("[+] Create Stream and read | " + moviesPathShort );
    var moviesStream = fs.createReadStream(moviesPathShort).pipe(parserMovies);
    //var genresStream = fs.createReadStream(genresMatrix).pipe(parseGenres);
    //var actorsStream = fs.createReadStream(actorsPath).pipe(parserActors);
    //var directorsStream = fs.createReadStream(directorsMatrix).pipe(parserDirectors);
}

parseAndSave();
