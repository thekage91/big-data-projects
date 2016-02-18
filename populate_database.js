/**
 * Created by ugo on 17/02/16.
 */

    'use strict';

var util = require('./test/util.js');
var express = require('express'),
    q = require('q');

process.env.NODE_ENV = 'test';

var app = require('./app.js');
var mongoose = app.mongoose;

var query_interface = require('./models/query_interface.js');
var save_interface = require('./models/save_interface.js');

(function () {

    var movie_number = 3500000;
    var genre_number = 40;
    var director_number = 8000000;
    var actor_number = 10000000;

    // un attore che ha fatto 1 film
    // un attore che ha fatto 10 film
    // un attore che ha fatto 100 film
    // un attore che ha fatto 10000 film
    // un attore che ha fatto 1000000 film
    // un regista che ha fatto 1 film
    // un regista che ha fatto 10 film
    // un regista che ha fatto 100 film
    // un regista che ha fatto 10000 film
    // un regista che ha fatto 1000000 film
    // Trovare per un certo regista i 5 attori con i quali ha fatto più film
    // Trovare per un attore i 5 Registi con i quali ha fatto più film
    /*
        attore1
        attore10       5
        attore100
        attore10000
        attore1000000
        attore50

        regista1
        regista10
        regista100
        regista10000
        regista1000000
        regista50

     */


        var attore1 = util.fakeActor();
        var attore10 = util.fakeActor();
        var attore100 = util.fakeActor();
        var attore10000 = util.fakeActor();
        var attore1000000 = util.fakeActor();
        var attore50 = util.fakeActor();


        var attore10 = util.fakeActor();
    console.log(attore10);
        var attore100 = util.fakeActor();
        var attore10000 = util.fakeActor();
        var attore1000000 = util.fakeActor();
        var attore50 = util.fakeActor();

        var regista1 = util.fakeDirector();
        var regista10 = util.fakeDirector();
        var regista100 = util.fakeDirector();
        var regista10000 = util.fakeDirector();
        var regista1000000 = util.fakeDirector();
        var regista50 = util.fakeDirector();

        var max = 1000;

    (function () {
        var num_to_save = 10;
        for(let i=0; i < num_to_save; i++){
            let movie_to_save = util.fakeMovie();
            movie_to_save.actors.push(attore10);
            movie_to_save.directors.push(regista10);
            save_interface.save(0,{movie: movie_to_save});
        }
        console.log(`Salvati ${num_to_save} film con attore ${attore10.firstName} ${attore10.lastName}` +
        ` e regista ${regista10.firstName} ${regista10.lastName}`);
    })();

    (function () {
        var num_to_save = 100;
        for(let i=0; i < num_to_save; i++){
            let movie_to_save = util.fakeMovie();
            movie_to_save.actors.push(attore100);
            movie_to_save.directors.push(regista100);
            save_interface.save(0,{movie: movie_to_save});
        }
        console.log(`Salvati ${num_to_save} film con attore ${attore100.firstName} ${attore100.lastName}` +
            ` e regista ${regista100.firstName} ${regista100.lastName}`);
    })();

    (function () {
        var num_to_save = 10000;
        for(let i=0; i < num_to_save; i++){
            let movie_to_save = util.fakeMovie();
            movie_to_save.actors.push(attore10000);
            movie_to_save.directors.push(regista10000);
            save_interface.save(0,{movie: movie_to_save});
        }
        console.log(`Salvati ${num_to_save} film con attore ${attore10000.firstName} ${attore10000.lastName}` +
            ` e regista ${regista10000.firstName} ${regista10000.lastName}`);
    })();


        /*for(let i=0; i < 10; i++){
            let movie_to_save = util.fakeMovie();
            fakeMovie.actors.push(attore10);
            fakeMovie.directors.push(regista10);
            save_interface.save(0,{movie: movie_to_save});
        }*/


})();
