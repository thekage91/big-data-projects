 'use strict';

var parse = require('csv-parse'),
    q = require('q');

var directors = {};

/* 
*   direcotors json --> { director_name: movies_array }
*/
var parserDirectors = parse({ delimiter: '\n', relax: true });

var currentRecord = [],
    currentDirector = "";

parserDirectors.on('readable', function(){

    var record;
    
    while(record = parserDirectors.read()){

        if( record[0].indexOf('\t') !== 0 ){

            currentRecord = record[0].split('\t');
            currentDirector = currentRecord[0].replace(',', '');
            directors[currentDirector] = [ currentRecord[1] ];
        }
        else{

            var movie = record[0].replace('\t', '');
            directors[currentDirector].push(movie);
        }
    };
});

var result = q.defer();

parserDirectors.on('finish', function(){

    result.resolve(directors);

    parserDirectors.end();
});

module.exports = {
    
    directors: result.promise,
    startParsing: parserDirectors
}



