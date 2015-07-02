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
	directorsPath = './dataset/directors.list.tsv',
	genresPath = './dataset/genres.list.tsv',
	actorsPath = './dataset/actors.list.tsv',
    moviesMatrix = './dataset/movies.matrix.list',
    directorsMatrix = './dataset/registi.matrix.list.solonontrova',
    genresMatrix = './dataset/generi.matrix.list',
    actorsMatrix = './dataset/attori.matrix.list',
    actressesMatrix = './dataset/attrici.matrix.list',
    provaPath = './dataset/prova.list.tsv',
    app = require('./app.js'),
    mongoose = require('mongoose'),
    Actor = mongoose.model('Actor');
    Director = mongoose.model('Director');
    Movie = mongoose.model('Movie')
    Genre = mongoose.model('Genre');



var moviePostApi = "/api/film"
var genrePostApi = "/api/genre"
var directorPostApi = "/api/director"
var actorPostApi = "/api/actor"


var directorsFields = ['first_name','last_name','film'];
var genreFields = ['film','genre'];
var actorFields = ['first_name','last_name','film','','','role'];



var callbackSave = function (err) { if(err) throw new Error(err); console.log('Succesfully updated')}
var parserDirectors = parse({delimiter: '\t',relax: true,columns:['first_name','last_name','film']}, function(err, data){


    var film;

    if(err) {
        console.error(err);
        return;
    }

    //console.info('INFOFOSDIF ' + JSON.stringify(data));
    data.forEach(function(elem) {
        //Per ogni riga, filtra via gli elementi vuoti
        Movie.find({title: elem.film.trim()}, function (err, movies) {
            if (err) throw new Error(err);
            if(movies.length === 0) {
                console.log('No movie with title: ' + elem.film);
                return;
            }
            movies.forEach(function (movie) {
                console.log('adding director to film: + '  elem.film');
                var director = new Director({first_name: elem.first_name,last_name: elem.last_name});
                director.movies.push(movie.id);
                movie.directors.push(director.id);
                director.save(callbackSave);
                movie.save(callbackSave);

            });

        })

    });

});




 var parserMovies = parse({delimiter: '\t',relax: true,columns:['title','','release_date']}, function(err, data){

 var film;

 if(err) {
 console.error(err);
 return;
 }

 //Per ogni riga, filtra via gli elementi vuoti
 data.forEach(function(elem){
     if(elem.undefined !== '' && elem.undefined !== undefined) {
         elem.release_date = elem.undefined;
         delete elem.undefined;
     }
     else if(elem[''] !== '') {
         elem.release_date = elem[''];
         if(elem.release_date === '????')
            delete elem.release_date;
         delete elem[''];
     }

     Movie.create(elem, function(err,movie) { if(err) throw new Error(err); /*console.log('Saved in database: ' + JSON.stringify(movie))*/});

 });

 });



var parserGenres = parse({delimiter: '\t',relax: true,columns:['film','genre']}, function(err, data){


    var film;

    if(err) {
        console.error(err);
        return;
    }

    //Per ogni riga, filtra via gli elementi vuoti
 data.forEach(function(elem){
     console.log(elem)
 });



});


var parserActors = parse({delimiter: '\t',relax: true,columns:['first_name','last_name','film','','','role']}, function(err, data){
    if(err) {
        console.error(err);
        return;
    }

    //Per ogni riga, filtra via gli elementi vuoti
    data.forEach(function(elem){
        console.log(elem);
    });
});


var moviesOutput = [];
var userOutput = [];
var genreOutput = [];
var dataOutput = [];

module.exports = {

	parsingDataAndSave :parseAndSave
}


var parseAndSave =  function(){

    console.log("[+] Create Stream and read | " + moviesPath + " | " +
    genresPath + " | " + directorsPath + " | " + actorsPath + " |");
    var moviesStream = fs.createReadStream(moviesMatrix).pipe(parserMovies);
    //var genresStream = fs.createReadStream(genresPath).pipe(parserGenres);
    //var actorsStream = fs.createReadStream(actorsPath).pipe(parserActors);
    var directorsStream = fs.createReadStream(directorsMatrix).pipe(parserDirectors);


    console.log("[DEBUG] Save | Actors | Films | Directors | Genres | on db")

}

parseAndSave();
