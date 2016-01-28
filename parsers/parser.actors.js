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

            currentRecord = record[0].split(',')[1].replace(' ', '').split(/\t/g);
            currentActor = currentRecord[0];
            var movie = currentRecord[currentRecord.length - 1].replace(/"/g, '').split('(')[0].slice(0, -1);
            //console.log("[DEBUG] Current movie (if true): " + movie);
            actors[currentActor] = [movie];
        }
        else{

            var movie = record[0].replace(/\t/g, '').split('(')[0].replace(/"/g, '').slice(0, -1);
            //console.log("[DEBUG] Current movie (else): " + movie);
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

