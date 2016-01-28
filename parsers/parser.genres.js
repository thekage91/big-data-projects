 'use strict';

var parse = require('csv-parse'),
    q = require('q');

var genres = {};

var regexMovie = function(title){

    return title.split(" (")[0].replace(/"/g, "");
}

/* 
*   Return genres json --> { genre: movies_array }
*/ 
var parserGenres = parse({ delimiter: '\t', relax: true});

parserGenres.on('readable', function(){

	var record;

    while( record = parserGenres.read() ){

        if(genres[record[record.length - 1]] === undefined ){

            genres[record[record.length - 1]] = [];
        }

        genres[record[record.length - 1]].push(regexMovie(record[0]));
    }
});
   
var result = q.defer();
parserGenres.on('finish', function(){

	result.resolve(genres);
	parserGenres.end();
});

module.exports = {

	genres: result.promise,
	startParsing: parserGenres
}
