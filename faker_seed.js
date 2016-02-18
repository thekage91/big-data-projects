'use strinct'

var util = require('./test/util.js'),
    SaverInterface = require("./models/save_interface.js"),


var MOVIES_NUMBER = 1000000
	ACTORS_NUMER = 500000
	DIRECTORS_NUMBER = 300000
	GENRES_NUMBER = 1000;

var max_actor_movie = 15,
	max_genre_movie = 5,
	max_director_movie = 25;

var _movies = [];
	_directors = [],
	_actors = [],
	_genres = [];

var pick_random_element = function(elements, quantity, NUM_ELEMENTS){

	var picked_element = [];
	var index_random = Math.floor((Math.random() * NUM_ELEMENTS) + 1);

	for( var i = 0; i <= quantity; i++ ){

		picked_element.push(elements[index_random]);
	}

	return picked_element;
};

var generate_movies = function(counter){

	if(counter == MOVIES_NUMBER){
		return util.fakeMovie();;
	}

	counter += 1;
    return movies.push(generate_movies(counter));
}

var generate_directors = function(counter){

	if(counter == DIRECTORS_NUMBER){
		return util.fakeDirector();;
	}

	counter += 1;
    return directors.push(generate_directors(counter));
	
}

var generate_actors = function(counter){

	if(counter == ACTORS_NUMER){
		return util.fakeActor());;
	}

	counter += 1;
    return actors.push(generate_actors(counter));
	
}

var generate_genres = function(counter){

	if(counter == GENRES_NUMBER){
		return util.fakeGenre();;
	}

	counter += 1;
    return genres.push(generate_genres(counter));
	
}

var save_version0 = function(){

	var versoion = 0;

	_movies.forEach(function(movie){

		let data = {}

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMER);
		data.movie.directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		data.movie.genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		SaverInterface.save(version, data);

		movie = null;
	});
}

/* MA */
var save_version1 = function(){

	var version = 1;

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
		
		actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMER);

		actors.forEach(function(actor_elem){

			data.actor = actor_elem;

			SaverInterface.save(version, data);
		});

		movie = null;
	});
}

/* MDA */
var save_version2 = function(){

	var version = 2;

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
		actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMER);

		actors.forEach(function(actor_elem){

			let index_director = Math.floor((Math.random() * directors.length) + 1);

			data.actor = actor_elem;
			data.director = directors[index_director];

			SaverInterface.save(version, data);
		});

	});
}

/* MD */
var save_version3 = function(){

	var version = 3;

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
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMER);

		directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);

		directors.forEach(function(director_elem){

			data.director = director_elem;

			SaverInterface.save(version, data);
		});

		movie = null;

	});
}

/* MG */
var save_version4 = function(){

	var version = 4;

	_movies.forEach(function(movie){

		let genres = [];

		let data = {};

		let quantity_actor = Math.floor((Math.random() * max_actor_movie) + 1);
		let quantity_director = Math.floor((Math.random() * max_director_movie) + 1);
		let quantity_genre = Math.floor((Math.random() * max_genre_movie) + 1);

		data.movie = {};
		data.director = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMER);
		data.movie.directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);

		genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		genres.forEach(function(genre_elem){

			data.genre = genre_elem;

			SaverInterface.save(version, data);
		});

		movie = null;

	});
}

/* MGD */
var save_version5 = function(){

	var version = 5;

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
		data.movie.actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMER);

		directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		directors.forEach(function(director_elem){

			let index_genre = Math.floor((Math.random() * genres.length) + 1);

			data.director = director_elem;
			data.genre = genres[index_genre];

			SaverInterface.save(version, data);
		});

		movie = null;
	});
}

/* MGDA */
var save_version6 = function(){

	var version = 6;

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
		data.actors = {};

		data.movie.title = movie.title;
		data.movie.release_date = movie.release_date;

		actors = pick_random_element(_actors, quantity_actor, ACTORS_NUMER);
		directors = pick_random_element(_directors, quantity_director, DIRECTORS_NUMBER);
		genres = pick_random_element(_genres, quantity_genre, GENRES_NUMBER);

		directors.forEach(function(director_elem){

			let index_genre = Math.floor((Math.random() * genres.length) + 1);
			let index_actor = Math.floor((Math.random() * actors.length) + 1);

			data.director = director_elem;
			data.genre = genres[index_genre];
			data.actor = actors[index_actor];

			SaverInterface.save(version, data);
		});

		movie = null;
	});
}


var seed = function(){

	console.log("Generate Movie, Directors, Actors and Genres...")

	generate_directors();
	generate_movies();
	generate_actors();
	generate_genres();

	console.log("Start saving...")

	console.log("Version 0...");
	save_version0();

	console.log("Version 1...");
	save_version1();

	console.log("Version 2...");
	save_version2();

	console.log("Version 3...");
	save_version3();

	console.log("Version 4...");
	save_version4();

	console.log("Version 5...");
	save_version5();

	console.log("Version 6...");
	save_version6();

}

module.exports = {

	seed: seed
}



