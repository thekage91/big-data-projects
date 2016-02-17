/**
 * Created by ugo on 16/02/16.
 */

    'use strict';




var express = require('express'),
    q = require('q'),
query_interface = require('./models/query_interface.js');

process.env.NODE_ENV = 'production';

var app = require('./app.js');
var mongoose = app.mongoose;


function printStats(version,query,elemNumber,totalTime) {
    console.log('Versione modello: ' + version);
    console.log('Query: ' + query);
    console.log('Numero di elementi in output: ' + elemNumber);
    console.log('Tempo totale di elaborazione; ' + totalTime);

}

function profile_query (document,query_function, description) {
    var actor = {name: 'pippo'};
    var director = {name: 'prova'};

    for(let i=0;i<7;i++)
        query_function(i, (document ==='actor' ? actor : director), function (err,response,time) {
        printStats(i, description,response.length,time);
    })

}


(function () {
    console.log('Misurazione dei tempi di query per i vari modelli di aggregati ')
    profile_query('actor',query_interface.all_films_one_actor,`Restituire tutti i film recitati da un dato attore`);
    profile_query('director',query_interface.all_films_one_director,`Restituire tutti i film girati da un certo regista`);
    profile_query('director',query_interface.top_5_actors_of_a_director,`Restituire tutti i film girati da un certo regista`);
    profile_query('actor',query_interface.top_5_directors_of_an_actor,`Restituire tutti i film girati da un certo regista`);

})();


