
var app = require('../app.js'),
	mongoose = app.mongoose;


var _movies = [],
	_actors = {},
	_directors = {},
	_genres = {};

var filter = function(element, obj){

    var result = [];

    for(var key in obj){

        if(obj[key].indexOf(element) !== -1){

            result.push(key);
        }
    }

    return result;
}

/* save Movies */
var saveM = function(){

    var Movie0 = mongoose.model('Movie0');  
    var movieToPost = {};
    
    /*
    *  Populet movies with relations
    */

    console.log("[DEBUG] Save save Movies...")

    movies.forEach(function(elem){

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        movieToPost.genres = filter(elem, genres);
        movieToPost.actors = filter(elem, actors);
        movieToPost.directors = filter(elem, directors);

        /*Movie0.create(movieToPost, function (err, movie) {
            if (err) throw new Error(err);
            console.log('Saved in database movie with id: ' + movie._id + " and title: " + movie.title);
        });*/
	});
}

/* save Movies Actors */ 
var saveMA= function(){

    var Movie0 = mongoose.model('Movie0');  
    
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

	return "Movies: " + JSON.stringify(_movies) + "\n\n" +
			"Directors: " + JSON.stringify(_directors) + "\n\n" + 
			"Actors: " + JSON.stringify(_actors) + "\n\n" + 
			"Genres: " + JSON.stringify(_genres) + "\n\n" ;
}


module.exports = {

	//Movies: _movies,
	Actors: _actors,
	Directors: _directors,
	Genres: _genres,
	getInfo: getInfo
}
