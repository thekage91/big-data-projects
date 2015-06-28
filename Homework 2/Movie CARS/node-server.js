
var express = require('express'),
	parser = require('./parser.js'),
	app = express();


console.log("Express server started at port 3000");

parser.parsingMovies();

app.listen(3000);