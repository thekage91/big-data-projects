
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

var postSchemaModel = function (SchemaModel, toPost, type) {

    SchemaModel.create(toPost, function (err, movie) {
            if (err) throw new Error(err);
            console.log('[DEBUG] Saved in database ' + type + ' with id: ' + toPost._id);
    });
}

/* save Movies */
var saveM = function(){

    var Movie0 = mongoose.model('Movie0'), 
        movieToPost = {};
    
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
	});
}

/* save Movies Actors */ 
var saveMA= function(){

    var Movie1 = mongoose.model('Movie1'),
        Actor1 = mongoose.model('Actor1'),
        movieToPost = {},
        actorToPost = {},
        local_genres = this.Genres,
        local_directors = this.Directors,
        actorToPost = {};

    this.Movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        movieToPost.genres = filter(elem, local_genres);
        //movieToPost.actors = filterObj(elem, local_actors);
        movieToPost.directors = filter(elem, this.Directors);

        console.log(movieToPost);

        //postSchemaModel(Movie1, movieToPost, "movie");
    });
    
    for(var key in this.Actors){

        actorToPost.first_name = key;

        //postSchemaModel(Actor1, actorToPost, "actor");
    }
    
};

/* save Movies Actors Directors */
var saveMAD = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* save Movies Directors */ 
var saveMD = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* save Movies Genres */ 
var saveMG = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* save Movies Genres Directors */ 
var saveMGD = function(){

    var Movie0 = mongoose.model('Movie0');  
    
};

/* save Movies Genres Directors Actors */ 
var saveMGDA = function(){

    var Movie0 = mongoose.model('Movie0');  
    
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
