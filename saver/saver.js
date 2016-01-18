
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

/* save Movies */
var saveM = function(){

    var Movie0 = mongoose.model('Movie0'), 
        movieToPost = {},
        local_genres = this.Genres,
        local_actors = this.Actors,
        local_directors = this.Directors;
    
    /*
    *  Populet movies with relations
    */
    
    console.log("Actors: \n");
    console.log(local_actors);
    console.log("\n\n");

  

    /*console.log("Directors: \n");
    console.log(local_directors);
    console.log("\n\n");*/

    this.Movies.forEach(function(elem){

        console.log("Title: " + elem.title );

        movieToPost.title = elem.title;
        movieToPost.release_date = elem.release_date;

        movieToPost.genres = filter(elem, local_genres);
        movieToPost.actors = filter(elem, local_actors);
        movieToPost.directors = filter(elem, local_directors);

        console.log(movieToPost)
        console.log("\n\n");
        
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

    saveM: saveM
}
