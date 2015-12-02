 'use strict';

var parse = require('csv-parse'),
    q = require('q');

var currentRecord = [],
    currentActor = "",
    actors = {};

var parserActors = parse({ delimiter: '\n', relax: true });

parserActors.on('readable', function(){

    /* 
    * actors: { nomeAttore: arrayFilms }
    */ 
    var record;

    while( record = parserActors.read() ){

        if( record[0].indexOf('\t') !== 0 ){

            currentRecord = record[0].split(',')[1].replace(' ', '').split('\t');
            currentActor = currentRecord[0];
            actors[currentActor] = [ currentRecord[currentRecord.length - 1].replace('"', '') ];
        }
        else{

            var movie = record[0].replace('\t', '');

            actors[currentActor].push(movie);
        }
    }
});

var result = q.defer();
parserActors.on('finish', function(){

    result.resolve(actors);
    parserActors.end();
    
})

module.exports = {

    actors: result.promise,
    startParsing: parserActors
}

