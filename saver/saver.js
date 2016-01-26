
var app = require('../app.js'),
	mongoose = app.mongoose;


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
        movieToPost = {};
    var version = 0;
    var data = {};
    
    /*
    *  Populet movies with relations
    */
    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        movieToPost.genres = filter(elem, this.Genres);
        movieToPost.actors = filter(elem, this.Actors);
        movieToPost.directors = filter(elem, this.Directors);

        /*Movie0.create(movieToPost, function (err, movie) {
            if (err) throw new Error(err);
            console.log('Saved in database movie with id: ' + movie._id + " and title: " + movie.title);
        });*/

        data.movie = movieToPost;

        SaverInterface.save(version, data);
	});
}

/* 
* save Movies Actors 
* version 1
*/ 
var saveMA= function(){

    // movie1 e acotr1 forse da togliere
    var Movie1 = mongoose.model('Movie1'),
        Actor1 = mongoose.model('Actor1'),
        movieToPost = {},
        actorToPost = {},
        local_genres = this.Genres,
        local_directors = this.Directors,
        actorToPost = {},
        version = 1,
        data = {};

    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        movieToPost.genres = filter(elem, local_genres);
        movieToPost.directors = filter(elem, local_directors);
        data.movie = movieToPost;

        SaverInterface.save(version, data);
    });
    
    for(var key in this.Actors){

        actorToPost.first_name = key;

        /*this.Actors[key].forEach(function(movie_title){
            
            var actorMovie = [];

            Movie1.findOne({ 'title': movie_title }, function(err, result){

                if(result !== null){
                    console.log("[DEBUG] Result: " + result._id);
                    actorMovie.push(result._id);
                }
            });
        });*/

        data.actor = actorToPost;
        
        SaverInterface.save(version, data);
    }

    // http://mongoosejs.com/docs/api.html

};

/* 
* save Movies Actors Directors 
* version 2
*/
var saveMAD = function(){

    var local_genres = this.Genres,
        data = {},
        version = 2,
        movieToPost = {},
        actorToPost = {},
        directorToPost = {};

    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;
        movieToPost.genres = local_genres;

        data.movie = movieToPost;

        SaverInterface.save(version, data);
    });     

    for(var key in this.Actors){

        actorToPost.first_name = key;
        data.actor = actorToPost;
        
        SaverInterface.save(version, data);
    }

    for(var key in this.Directors){

        directorToPost.first_name = key;
        data.director = directorToPost;
        
        SaverInterface.save(version, data);
    }
};

/*
* save Movies Directors 
* version 3
*/ 
var saveMD = function(){

    var local_genres = this.Genres,
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
    }   
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
    saveMA: saveMA
}
