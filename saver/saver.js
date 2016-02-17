'use strict';

var app = require('../app.js'),
	mongoose = app.mongoose,
    SaverInterface = require("../models/save_interface.js"),
    q = require('q'),
    Movie0 = mongoose.model('Movie0');


var _movies = [],
	_actors = {},
	_directors = {},
	_genres = {};

var filter = function(element, obj){

    var result = [];

    for(var key in obj){

        if(obj[key].indexOf(element.title) !== -1){

            result.push(key);
        }
    }

    return result;
}

var saveSync = function(data, version){
    
    if(data.length == 0){
        return;
    }
    
    SaverInterface.save(version, data.shift()).then(function(response){
        
        saveSync(data, version);
    });   
}

var findActorByFilm = function(movie_title){

    var local_actors = this.Actors,
        result = [];

    for(var key in local_actors){

        console.log("Movie: " + movie_title + " Actor: " + key);        
        if(local_actors[key].indexOf(movie_title) !== -1){
            result.push(key);
        }
    }

    return result;
}

/*
* save Movies
* version 0
*/
var saveM = function(){

    var local_genres = this.Genres,
        local_directors = this.Directors,
        local_actors = this.Actors,
        version = 0,
        i = 0;    
   
    console.log("Version 0");
    this.Movies.forEach(function(movie){

        let data = {}
        data.movie = {};
        data.movie.title = movie.title;
        data.movie.release_date = movie.release_date;

        data.movie.genres = filter(movie, local_genres);
        data.movie.actors = filter(movie, local_actors);
        data.movie.directors = filter(movie, local_directors);
        
        //console.log("Save movie: " + data.movie.title);
        SaverInterface.save(version, data);
        /*
        var movieSave = new Movie0(data.movie);
        movieSave.save(function (err){

            if (err) return handleError(err);
            console.log("movie: " + data.movie.title + " saved");
        });
        */
        movie = null;
        i += 1;
	});

    console.log("FINE")
}

/*
* save Movies Actors
* version 1
*/
var saveMA= function(){

    var local_genres = this.Genres,
        local_directors = this.Directors,
        local_actors = this.Actors,
        version = 1,
        dataToPost = [];
        //data = {};

    console.log("Version 1");
    this.Movies.forEach(function(movie){

        let movieToPost = {};
        //let movie_title = movie.title;
        movieToPost.title = movie.title;
        movieToPost.release_date = movie.release_date;

        movieToPost.genres = filter(movie, local_genres);
        movieToPost.directors = filter(movie, local_directors);

        for(let key in local_actors){

            if(local_actors[key].indexOf(movie.title) !== -1){

                let data = {};

                data.actor = {};
                data.movie = {};

                data.actor.first_name = key;
                data.movie = movieToPost;
                //console.log("Movie title: " + data.movie.title + " Actor title: " + data.actor.first_name);

                dataToPost.push(data);

            }
        }

        movie = null;
    });

    saveSync(dataToPost, version);
};

/*
* save Movies Actors Directors
* version 2
*/
var saveMAD = function(){

    var local_genres = this.Genres,
        local_directors = this.Directors,
        local_actors = this.Actors,
        version = 2,
        dataToPost = [];

    console.log("Version 2");
    this.Movies.forEach(function(movie){

        let movieToPost = {};

        movieToPost.title = movie.title;
        movieToPost.release_date = movie.release_date;
        movieToPost.genres = filter(movie, local_genres);

        for(let key in local_actors){

            if(local_actors[key].indexOf(movie.title) !== -1){

                let actorToPost = {};

                actorToPost.first_name = key;

                for(let key in local_directors){

                    if(local_directors[key].indexOf(movie.title) !== -1){

                        let data = {};
                        //console.log("director:" + key + " actor: " + actorToPost.first_name + " movie: " + movie.title + "\n");
                        data.director = {};

                        data.director.first_name = key;
                        data.actor = actorToPost;
                        data.movie = movieToPost;

                        dataToPost.push(data);
                    }
                }
            }
        }

        movie = null;
    });

    saveSync(dataToPost, version);
};

/*
* save Movies Directors
* version 3
*/
var saveMD = function(){
 
    var local_genres = this.Genres,
    local_directors = this.Directors,
    local_actors = this.Actors,
    version = 3,
    dataToPost = [];

    console.log("Version 3");
    this.Movies.forEach(function(movie){

        let movieToPost = {};
        //let movie_title = movie.title;
        movieToPost.title = movie.title;
        movieToPost.release_date = movie.release_date;

        movieToPost.genres = filter(movie, local_genres);
        movieToPost.actors = filter(movie, local_actors);

        for(let key in local_directors){

            if(local_directors[key].indexOf(movie.title) !== -1){
                
                let data = {};

                data.director = {};
                data.movie = {};

                data.director.first_name = key;
                data.movie = movieToPost;
                SaverInterface.save(version, data);
            }
        }

        movie = null;
    });
};

/*
* save Movies Genres
* version 4
*/
var saveMG = function(){

    var local_genres = this.Genres,
    local_directors = this.Directors,
    local_actors = this.Actors,
    version = 4;
    //data = {};

    console.log("Version 4");
    this.Movies.forEach(function(movie){

        let movieToPost = {};
        //let movie_title = movie.title;
        movieToPost.title = movie.title;
        movieToPost.release_date = movie.release_date;

        movieToPost.directors = filter(movie, local_directors);
        movieToPost.actors = filter(movie, local_actors);

        for(let key in local_genres){

            if(local_genres[key].indexOf(movie.title) !== -1){
                
                let data = {};

                data.genre = {};
                data.movie = {};

                data.genre.name = key;
                data.movie = movieToPost;
                SaverInterface.save(version, data);
            }
        }

        movie = null;
    });
};

/*
* save Movies Genres Directors
* version 5
*/
var saveMGD = function(){

    var local_genres = this.Genres,
        local_directors = this.Directors,
        local_actors = this.Actors,
        version = 5,
        dataToPost = [];

    console.log("Version 5");
    this.Movies.forEach(function(movie){

        let movieToPost = {};

        movieToPost.title = movie.title;
        movieToPost.release_date = movie.release_date;
        movieToPost.actors = filter(movie, local_actors);

        for(let key in local_genres){

            if(local_genres[key].indexOf(movie.title) !== -1){
                
                let genreToPost = {};

                genreToPost.name = key;

                for(let key in local_directors){
                    
                    if(local_directors[key].indexOf(movie.title) !== -1){
                        
                        let data = {};
                        data.director = {};

                        data.director.first_name = key;
                        data.genre = genreToPost;
                        data.movie = movieToPost;

                        dataToPost.push(data);
                    }
                }
            }
        }

        movie = null;
    });

    saveSync(dataToPost, version);  
};

/*
* save Movies Genres Directors Actors
* version 6
*/
var saveMGDA = function(){

    var local_genres = this.Genres,
        local_directors = this.Directors,
        local_actors = this.Actors,
        version = 6,
        dataToPost = [];

    console.log("Version 6");
    this.Movies.forEach(function(movie){

        let movieToPost = {};

        movieToPost.title = movie.title;
        movieToPost.release_date = movie.release_date;

        for(let key in local_actors){

            if(local_actors[key].indexOf(movie.title) !== -1){

                let actorToPost = {};

                actorToPost.first_name = key;

                 for(let key in local_genres){

                    if(local_genres[key].indexOf(movie.title) !== -1){
                        
                        let genreToPost = {};

                        genreToPost.name = key;

                        for(let key in local_directors){
                            
                            if(local_directors[key].indexOf(movie.title) !== -1){
                                
                                let data = {};
                                data.director = {};

                                data.director.first_name = key;
                                data.genre = genreToPost;
                                data.actor = actorToPost;
                                data.movie = movieToPost;

                                //console.log("[DEBUG] Movie: " + data.movie.title + " Genre: " + data.genre.name + " Actor: " + data.actor.first_name + " Director: " + data.director.first_name)
                                dataToPost.push(data);
                            }
                        }
                    }
                }
            }
        }

        movie = null;
    });

    saveSync(dataToPost, version);  
};

var getInfo = function(){

	return "Movies: " + JSON.stringify( this.Movies ) + "\n\n" +
			"Directors: " + JSON.stringify( this.Directors ) + "\n\n" +
			"Actors: " + JSON.stringify( this.Actors ) + "\n\n" +
			"Genres: " + JSON.stringify( this.Genres ) + "\n\n" ;
}


module.exports = {

	//Movies: _movies,
	Actors: _actors,
	Directors: _directors,
	Genres: _genres,
	getInfo: getInfo,

    saveM: saveM,
    saveMA: saveMA,
    saveMAD: saveMAD,
    saveMD: saveMD,
    saveMG: saveMG,
    saveMGD: saveMGD,
    saveMGDA: saveMGDA
}
