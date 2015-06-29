/*         
	Movie structure:
	
	movie id | movie title | release date | video release date |
	IMDb URL | unknown | Action | Adventure | Animation |
	Children's | Comedy | Crime | Documentary | Drama | Fantasy |
	Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
	Thriller | War | Western |
*/

var fs = require('fs'),
	parse = require('csv-parser'),
	moviesPath = './dataset/movies.list',
	directorsPath = './dataset/directors.list',
	genresPath = './dataset/genres.list',
	actorsPath = './dataset/actors.list';

var moviePostApi = "/api/film"
var genrePostApi = "/api/genre"
var directorPostApi = "/api/director"
var actorPostApi = "/api/actor"

/*
var parserMovies = parse({delimiter: '|' }, function(err, data){

	console.log("[DEBUG] In parserMovie");
	data.forEach(function(elem){
	})

	request(app)
    .post(moviePostApi)
    .set('Accept', 'application/json')
    .send({"film": {"title": data[0][0], "release_date": data[0][1], "writer": data[0][2], 
    					"stars": data[0][3], "ratings": data[0][4], "actors": data[][], 
    					"certificate": data[][], "country": data[][], "writers": data[][], 
    					"distributors": data[][]}})
    .end(function(err, res) {
      if (err) {
      	console.log(err);
        throw err;
      }
      _id = res.body._id;
      console.log("[SUCCESS POST] Insert film with id --> ", _id);
      done();
    });
});

var parserDirectors = parse({delimiter: '|' }, function(err, data){

	request(app)
    .post(directorPostApi)
    .set('Accept', 'application/json')
    .send({"director": {"name": data[0][0]}})
    .end(function(err, res) {
      if (err) {
      	console.log(err);
        throw err;
      }
      _id = res.body._id;
      console.log("[SUCCESS POST] Insert director with id --> ", _id);
      done();
    });
});
*/

var parserGenres = parse({delimiter: '"' }, function(err, data){

	console.log("[DEBUG] In parserMovie");
	data.forEach(function(elem){
		console.log(data[0]);
	})

	request(app)
    .post(genrePostApi)
    .set('Accept', 'application/json')
    .send({"genre": {"name": data[0][0]}})
    .end(function(err, res) {
      if (err) {
      	console.log(err);
        throw err;
      }
      _id = res.body._id;
      console.log("[SUCCESS POST] Insert film with id --> ", _id);
      done();
    });
});

/*
var parserActors = parse({delimiter: '|' }, function(err, data){

	console.log("[DEBUG] In parserMovie");
	data.forEach(function(elem){
	})

	request(app)
    .post(actorPostApi)
    .set('Accept', 'application/json')
    .send({"actor": {"name": data[0][0}})
    .end(function(err, res) {
      if (err) {
      	console.log(err);
        throw err;
      }
      _id = res.body._id;
      console.log("[SUCCESS POST] Insert actor with id --> ", _id);
      done();
    });
});
*/

var moviesOutput = [];
var userOutput = [];
var genreOutput = [];
var dataOutput = [];

module.exports = {

	parsingDataAndSave : function(){

		console.log("[+] Create Stream and read | " + moviesPath + " | " + 
						genresPath + " | " + directorsPath + " | " + actorsPath + " |");

		//var moviesStream = fs.createReadStream(moviesPath).pipe(parserMovie);
		var genresStream = fs.createReadStream(genresPath, {start: 381}).pipe(parserGenres);
		//var actorsStream = fs.createReadStream(actorsPath).pipe(parserActors);
		//var directorsStream = fs.createReadStream(directorsPath).pipe(parserDirectors);

		console.log("[DEBUG] Save | Actors | Films | Directors | Genres | on db")
	}
} 


