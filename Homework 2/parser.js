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
	moviesPath = './dataset/u.item',
	userPath = './dataset/u.user',
	genrePath = './dataset/u.genre',
	dataPath = './dataset/u.data';

var moviesApi = ""

var parserMovie = parse({delimiter: '|' }, function(err, data){

	console.log("[DEBUG] In parserMovie");
	data.forEach(function(elem){
		console.log("[DEBUG] Print movie information -> " +
					  "id " + data[0][0] + 
					  " title " + data[0][1] + 
					  " release-date " + data[0][2] + 
					  " video-release-date " + data[0][3] + 
					  " url " + data[0][4])
	})

	request(app)
    .post('/api/movie')
    .set('Accept', 'application/json')
    .send({"movie": {"id": data[0][0], "title": data[0][1],"release-date": data[0][2], "video-release-date": data[0][3], "url": data[0][4]}})
    .end(function(err, res) {
      if (err) {
      	console.log(err);
        throw err;
      }
      _id = res.body._id;
      console.log("[SUCCESS POST] Insert movie with id --> ", _id);
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


