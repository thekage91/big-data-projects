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
	filmPath = './dataset/movies.list',
	actorPath = './dataset/actors.list',
	directorPath = './dataset/directors.list',
	genrePath = './dataset/genres.list';

var moviesApi = ""

var parserDataAndSave = parse({delimiter: '|' }, function(err, data){

	console.log("[DEBUG] In parserMovie");
	data.forEach(function(elem){
		
	})

	request(app)
    .post('/film')
    .set('Accept', 'application/json')
    .send({"film": {"title": data[0][1],"release-date": data[0][2], "writer": data[0][3], 
    				"starts": data[0][4]}, "ratings": data[][], "actors": data[][], 
					"certificate": data[][], "country": data[][], "writers": data[][],
					"distributors": data[][]})
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

var moviesOutput = [];
var userOutput = [];
var genreOutput = [];
var dataOutput = [];

module.exports = {

	parsingMovies : function(){

		console.log("[+] Create Stream and read " + moviesPath);
		var moviesStream = fs.createReadStream(moviesPath).pipe(parserMovie);
		console.log("[DEBUG] moviesStream --> ", moviesStream);
	}
} 


