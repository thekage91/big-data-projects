/**
 * Created by ugo on 16/02/16.
 */

'use strict';


var fs = require('fs');
var express = require('express'),
    q = require('q'),
    query_interface = require('./models/query_interface.js');

process.env.NODE_ENV = 'production';

var app = require('./app.js');
var mongoose = app.mongoose;


function printStats(version, query, elemNumber, totalTime) {
    var result_string = `\n Versione modello: ${version}
    Query: ${query}
    Numero di elementi in output: ${(elemNumber || 0)}
    Tempo totale di elaborazione: ${totalTime}\n`;

    console.log(result_string);
    fs.appendFile("./execution.log", result_string, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

}

function profile_query(document, query_function, description) {
    var actor = 'Della';
    var director = 'River';
    var end = q.defer();

    /* query_interface.all_films_one_actor(0, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(0, description, response.length, time);
     })*/

    query_function.call(query_interface, 0, (document === 'actor' ? actor : director), function (err, response, time) {
        printStats(0, description, response.length, time);
        query_function.call(query_interface, 1, (document === 'actor' ? actor : director), function (err, response, time) {
            printStats(1, description, response.length, time);
            query_function.call(query_interface, 2, (document === 'actor' ? actor : director), function (err, response, time) {
                printStats(2, description, response.length, time);
                query_function.call(query_interface, 3, (document === 'actor' ? actor : director), function (err, response, time) {
                    printStats(3, description, response.length, time);
                    query_function.call(query_interface, 4, (document === 'actor' ? actor : director), function (err, response, time) {
                        printStats(4, description, response.length, time);
                        query_function.call(query_interface, 5, (document === 'actor' ? actor : director), function (err, response, time) {
                            printStats(5, description, response.length, time);
                            query_function.call(query_interface, 6, (document === 'actor' ? actor : director), function (err, response, time) {
                                printStats(6, description, response.length, time);
                                console.log('\n\n')
                                end.resolve();
                            });
                        });
                    });
                });
            });
        });
    });

    return end.promise;

    /*
     query_function.call(query_interface, 0, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(0, description, response.length, time);
     });
     query_function.call(query_interface, 1, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(1, description, response.length, time);
     });

     query_function.call(query_interface, 2, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(2, description, response.length, time);
     });
     query_function.call(query_interface, 3, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(3, description, response.length, time);
     });
     query_function.call(query_interface, 4, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(4, description, response.length, time);
     });
     query_function.call(query_interface, 5, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(5, description, response.length, time);
     });
     query_function.call(query_interface, 6, (document === 'actor' ? actor : director), function (err, response, time) {
     printStats(6, description, response.length, time);
     });
     /*query_interface.all_films_one_actor(0, (document ==='actor' ? actor : director), function (err,response,time) {
     printStats(0, description,response.length,time);
     })*/

}


(function () {
    mongoose.connection.on('connected', function () {

            console.log('Misurazione dei tempi di query per i vari modelli di aggregati ');
        //profile_query('director',query_interface.top_5_actors_of_a_director,`Trovare per un certo regista i 5 attori con i quali ha fatto più film`);
        profile_query('actor',query_interface.top_5_directors_of_an_actor,`Trovare per un attore i 5 Registi con i quali ha fatto più film`);

          /*  profile_query('actor', query_interface.all_films_one_actor, `Restituire tutti i film recitati da un dato attore`)
        .then( () => { profile_query('director',query_interface.all_films_one_director,`Restituire tutti i film girati da un certo regista`);})
        .then( () => { profile_query('director',query_interface.top_5_actors_of_a_director,`Trovare per un certo regista i 5 attori con i quali ha fatto più film`);})
   */ });

    /* .then( () => { profile_query('director',query_interface.all_films_one_director,`Restituire tutti i film girati da un certo regista`);})
     .then( () => { profile_query('director',query_interface.top_5_actors_of_a_director,`Trovare per un certo regista i 5 attori con i quali ha fatto più film`);})
     .then( () => { profile_query('actor',query_interface.top_5_directors_of_an_actor,`Trovare per un attore i 5 Registi con i quali ha fatto più film`);})*/

    //
    // profile_query('director',query_interface.top_5_actors_of_a_director,`Trovare per un certo regista i 5 attori con i quali ha fatto più film`);
    // profile_query('actor',query_interface.top_5_directors_of_an_actor,`Trovare per un attore i 5 Registi con i quali ha fatto più film`);

})();


