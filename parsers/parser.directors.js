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
            var movie = currentRecord[1].replace(/\t/g, '').split('(')[0].slice(0, -1).replace('"', '');

            directors[currentDirector] = [ movie ];
        }
        else{

            var movie = record[0].replace(/\t/g, '').split('(')[0].slice(0, -1).replace(/"/g, '');
          
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



