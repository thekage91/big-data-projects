'use strict'

var app = require('../app.js'),
	mongoose = app.mongoose,
    SaverInterface = require("../models/save_interface.js"),
    q = require('q');


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

var filterObj = function(element, obj){

    var result = [];

}

/* example: postSchemaModel(Movie1, movieToPost, "movie"); */
var postSchemaModel = function (SchemaModel, toPost, type) {

    SchemaModel.create(toPost, function (err, elem) {
            if (err) throw new Error(err);
            console.log('[DEBUG] Saved in database ' + type + ' with id: ' + elem._id);
    });
}

/* 
* save Movies 
* version 0 
*/
var saveM = function(){

    var Movie0 = mongoose.model('Movie0'), 
        local_genres = this.Genres,
        local_directors = this.Directors,
        local_actors = this.Actors,
        movieToPost = {},
        version = 0,
        data = {};
    
    /*
    *  Populet movies with relations
    */
    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        movieToPost.genres = filter(elem, local_genres);
        movieToPost.actors = filter(elem, local_actors);
        movieToPost.directors = filter(elem, local_directors);

        data.movie = movieToPost;

        SaverInterface.save(version, data);
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

var saveSync = function(data, version){
    
    if(data.length == 0){
        return;
    }
    
    console.log("movie: " + data[0].movie.title + " actor: " + data[0].actor.first_name + " director: " + data[0].director.first_name);
    SaverInterface.save(version, data.shift()).then(function(response){
        
        saveSync(data, version);
    });   
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
                SaverInterface.save(version, data);
            }
        }

        movie = null;
    });

    //saveSync(dataToPost, version);    
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

    console.log("[DEBUG] Start save version 2")

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
        //dataToPost.push(data);
    });

    //console.log(dataToPost);

    saveSync(dataToPost, version);  
};

/*
* save Movies Directors 
* version 3
*/ 
var saveMD = function(){

   /* var local_genres = this.Genres,
        local_actors = this.Actors,
        data = {},
        version = 3,
        movieToPost = {},
        directorToPost = {};

    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;
        movieToPost.genres = local_genres;
        movieToPost.actors = local_actors;

        data.movie = movieToPost;

        SaverInterface.save(version, data);
    });  

    for(var key in this.Directors){

        directorToPost.first_name = key;
        data.director = directorToPost;
        
        SaverInterface.save(version, data);
    }   */

    console.log("EFefew")
    var local_genres = this.Genres,
    local_directors = this.Directors,
    local_actors = this.Actors,
    version = 3,
    dataToPost = [];
        //data = {};

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

    var local_actors = this.Actors,
        local_directors = this.Directors,
        data = {},
        version = 4,
        movieToPost = {},
        genreToPost = {};

    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;
        movieToPost.actors = local_actors;
        movieToPost.directors = local_directors;

        data.movie = movieToPost;

        SaverInterface.save(version, data);
    });  

    for(var key in this.Genres){

        genresToPost.name = key;
        data.genre = genreToPost;
        
        SaverInterface.save(version, data);
    }  
};

/* 
* save Movies Genres Directors 
* version 5
*/ 
var saveMGD = function(){

    var local_actors = this.Actors,
        data = {},
        version = 5,
        movieToPost = {},
        genreToPost = {},
        directorToPost = {};

    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;
        movieToPost.actors = local_actors;

        data.movie = movieToPost;

        SaverInterface.save(version, data);
    });  

    for(var key in this.Genres){

        genresToPost.name = key;
        data.genre = genreToPost;
        
        SaverInterface.save(version, data);
    }  

    for(var key in this.Directors){

        directorToPost.first_name = key;
        data.director = directorToPost;
        
        SaverInterface.save(version, data);
    }    
};

/*
* save Movies Genres Directors Actors 
* version 6
*/ 
var saveMGDA = function(){

    var data = {},
        version = 6,
        movieToPost = {},
        genreToPost = {},
        directorToPost = {},
        actorToPost = {};
    
    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        data.movie = movieToPost;

        SaverInterface.save(version, data);
    });  

    for(var key in this.Genres){

        genresToPost.name = key;
        data.genre = genreToPost;
        
        SaverInterface.save(version, data);
    }  

    for(var key in this.Directors){

        directorToPost.first_name = key;
        data.director = directorToPost;
        
        SaverInterface.save(version, data);
    } 

    for(var key in this.Actors){

        directorToPost.first_name = key;
        data.actor = actorToPost;
        
        SaverInterface.save(version, data);
    }  
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
    saveMD: saveMD
}
