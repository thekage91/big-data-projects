 'use strict';

var parse = require('csv-parse');

/* 
*   Return array di json di films
*   film json --> { title: "foo", release_date: "33433" }
*/

var films = [];
var temp_title = "";

var regexMovie = function(title){

    return title.split(" (")[0].replace(/"/g, "");
}

var parserMovies = parse({delimiter: '\t', relax: true, columns: ['title', 'release_date']});

parserMovies.on('readable', function(){

    var record;
    
    while(record = parserMovies.read()){

        var film = {};    
        //Per ogni riga, filtra via gli elementi vuoti

        film.title = regexMovie(record.title);

        /* 
        * Essendo il film ordinati in maniera crescente, effettuo un controllo del precendete
        * Se il precedente è uguale al corrente allora sto aggiungendo un duplicato, 
        * quindi salto la fase di salvataggio 
        */
        if(temp_title !== film.title){

            var temp_date = record.undefined;

            if(temp_date != undefined && temp_date.includes("-????")){
                film.release_date = temp_date.replace("-????", "");
            }
            else{
                film.release_date = temp_date;
            }

            temp_title = film.title;
            films.push(film);
        }
    }
})

parserMovies.on('finish', function() {

    console.log("[DEBUG] Movies");
    films.forEach(function(elem){ 
        console.log(elem); 
    });

    parserMovies.end();
});


module.exports = {
    
    title: temp_title,
    movies: films,
    startParsing: parserMovies
}
