"use strict";

var app = require('./app.js'),
	mongoose = app.mongoose,
    SaverInterface = require("./models/save_interface.js"),
    q = require('q'),
    Movie0 = mongoose.model('Movie0'),
    util = require('./test/util.js');


var MOVIES_NUMBER = 10000,
	ACTORS_NUMBER = 2000,
	DIRECTORS_NUMBER = 300,
	GENRES_NUMBER = 100;

var max_actor_movie = 15,
	max_genre_movie = 5,
	max_director_movie = 25;

var _movies = [],
	_directors = [],
	_actors = [],
	_genres = [];

var saveSync = function(version, data){
    
    if(data.length == 0){
        return;
    }
    
    SaverInterface.save(version, data.shift()).then(function(response){
        
        saveSync(data, version);
    });   
}

var pick_random_element = function(elements, quantity, NUM_ELEMENTS){

	var picked_element = [];

	for(var i = 0; i <= quantity; i++){

		var index_random = Math.floor((Math.random() * NUM_ELEMENTS) + 1);
		picked_element.push(elements[index_random]);
	}

	return picked_element;
};

var generate_movies = function(){

	for(var i = 0; i <= MOVIES_NUMBER; i++){

		_movies.push(util.fakeMovie());
	}

	console.log("Movies length: " + _movies.length)
}

var generate_directors = function(){

	for(var i = 0; i <= DIRECTORS_NUMBER; i++){

		_directors.push(util.fakeDirector());
	}
}

var generate_actors = function(){

	for(var i = 0; i <= ACTORS_NUMBER; i++){

		_actors.push(util.fakeActor());
	}
}

var generate_genres = function(){

	for(var i = 0; i <= GENRES_NUMBER; i++){

		_genres.push(util.fakeGenre());
	}
}

var save_version0 = function(){

	var version = 0;
	var i = 0;

	console.log("Version 0...");

	_movies.forEach(function(movie){

		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMBER);
		data.movie.directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		data.movie.genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		//console.log("Movie: " + i + " title:  " + data.movie.title + " actors length: " + 
			//+ data.movie.actors.length + " directors length: " + data.movie.directors.length + " genres length: " + data.movie.genres.length);

		SaverInterface.save(version, data);

		movie = null;
		i += 1;
	});
}

/* MA */
var save_version1 = function(){

	var version = 1;

	console.log("Version 1...");

	_movies.forEach(function(movie){

		let actors = [];
		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};
		data.actor = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		data.movie.genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);
		
		actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMBER);

		actors.forEach(function(actor_elem){

			data.actor.first_name = actor_elem;

			SaverInterface.save(version, data);
		});

		movie = null;
	});
}

/* MDA */
var save_version2 = function(){

	var version = 2;

	console.log("Version 2...");
	
	_movies.forEach(function(movie){

		let actors = [];
		let directors = [];
		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};
		data.actor = {};
		data.director = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMBER);

		actors.forEach(function(actor_elem){

			let index_director = Math.floor((Math.random() * directors.length) + 1);

			data.actor.first_name = actor_elem;
			data.director.first_name = directors[index_director];

			SaverInterface.save(version, data);
		});

	});
}

/* MD */
var save_version3 = function(){

	var version = 3;
	
	console.log("Version 3...");

	_movies.forEach(function(movie){

		let directors = [];

		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};
		data.director = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMBER);

		directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);

		directors.forEach(function(director_elem){

			data.director.first_name = director_elem;

			SaverInterface.save(version, data);
		});

		movie = null;

	});
}

/* MG */
var save_version4 = function(){

	var version = 4;

	console.log("Version 4...");

	_movies.forEach(function(movie){

		let genres = [];

		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};
		data.genre = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMBER);
		data.movie.directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);

		genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		genres.forEach(function(genre_elem){

			data.genre.name = genre_elem;

			SaverInterface.save(version, data);
		});

		movie = null;

	});
}

/* MGD */
var save_version5 = function(){

	var version = 5,
		dataToPost = [];

	console.log("Version 5...");

	_movies.forEach(function(movie){

		let genres = [];
		let directors = [];

		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};
		data.director = {};
		data.genre = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMBER);

		directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		directors.forEach(function(director_elem){

			let index_genre = Math.floor((Math.random() * genres.length) + 1);

			data.director.first_name = director_elem;
			data.genre.name = genres[index_genre];

			//dataToPost.push(data);
			SaverInterface.save(version, data);
		});

		movie = null;
	});

	//saveSync(version, dataToPost);
}

/* MGDA */
var save_version6 = function(){

	var version = 6;

	console.log("Version 6...");

	_movies.forEach(function(movie){

		let actors = [];
		let directors = [];
		let genres = [];

		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};
		data.director = {};
		data.actor = {};
		data.genre = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;

		actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMBER);
		directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		directors.forEach(function(director_elem){

			let index_genre = Math.floor((Math.random() * genres.length) + 1);
			let index_actor = Math.floor((Math.random() * actors.length) + 1);

			data.director.first_name = director_elem;
			data.genre.name = genres[index_genre];
			data.actor.first_name = actors[index_actor];

			SaverInterface.save(version, data);
		});

		movie = null;
	});
}


var seed = function(){

	console.log("Generate Movie, Directors, Actors and Genres...")

	generate_movies();
	generate_directors();
	generate_actors();
	generate_genres();

	console.log("Movies: " + _movies.length + " Directors: " + _directors.length + " Actors: " + _actors.length + " Genres: " + _genres.length);
	console.log("Start saving...")

	save_version0();

	save_version1();

	save_version2();

	save_version3();

	save_version4();

	save_version5();

	//save_version6();

	console.log("Finish saving...")

}

module.exports = {

	seed: seed
}


seed();



