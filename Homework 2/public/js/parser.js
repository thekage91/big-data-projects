/*         
	Movie structure:
	
	movie id | movie title | release date | video release date |
	IMDb URL | unknown | Action | Adventure | Animation |
	Children's | Comedy | Crime | Documentary | Drama | Fantasy |
	Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
	Thriller | War | Western |
*/

var fs = require('fs'),
	parse = require('csv-parser');

var moviesPath = './u.item',
	userPath = 'dataset/u.user',
	genrePath = 'dataset/u.genre',
	dataPath = 'dataset/u.data';


var moviesApi = ""

var parserMovie = parse({delimiter: '|' }, function(err, data){

	console.log("ciaoo");
	
})

module.exports = {

	parsingMovies : function(){

		console.log("[+] Create Stream and read " + "./u.item");
		var moviesStream = fs.createReadStream(moviesPath).pipe(parse({delimiter: '|' }, function(err, data){

	console.log("ciaoo");
	
}));
	}
} 







