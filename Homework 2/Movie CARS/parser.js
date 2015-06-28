
var fs = require('fs'),
	parse = require('csv-parser');

var moviesPath = './dataset/u.item.csv'
var userPath = "./dataset/u.user"
var genrePath = "./dataset/u.genre"
var dataPath = "./dataset/u.data"

var parser = parse({delimiter: '|'}, function(err, data){

	console.log(data);
});

module.exports = {
	parsingMovies: function(){
		console.log("[DEBUG] parsingMovies");
		//fs.createReadStream(moviesPath).pipe(parser);
		fs.readFile('foo.txt', function (err, data) {

			  if (err) console.log("errore");
			  console.log(data);
			});
	}
};