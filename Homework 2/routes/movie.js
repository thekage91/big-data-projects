module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Movie = mongoose.models.Movie,
      api = {};

  // ALL
  api.movies = function (req, res) {
    Movie.find(function(err, movies) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({movies: movies});
      }
    });
  };

  // GET
  api.movie = function (req, res) {
    var id = req.params.id;
    Movie.findOne({ '_id': id }, function(err, movie) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json({movie: movie});
      }
    });
  };

  // POST
  api.addMovie = function (req, res) {

    var movie;

    if(typeof req.body.movie == 'undefined'){
      res.status(500).json({message: 'movie is undefined'});
    }

    movie = new Movie(req.body.movie);

    movie.save(function (err) {
      if (!err) {
        console.log("created movie");
        return res.status(201).json(movie.toObject());
      } else {
        return res.status(500).json(err);
      }
    });

  };

  // PUT
  api.editMovie = function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {


    
      if(typeof req.body.movie["id"] != 'undefined'){
        movie["id"] = req.body.movie["id"];
      }
    
      if(typeof req.body.movie["title"] != 'undefined'){
        movie["title"] = req.body.movie["title"];
      }
    
      if(typeof req.body.movie["release-date"] != 'undefined'){
        movie["release-date"] = req.body.movie["release-date"];
      }
    
      if(typeof req.body.movie["video-release-date"] != 'undefined'){
        movie["video-release-date"] = req.body.movie["video-release-date"];
      }
    
      if(typeof req.body.movie["url"] != 'undefined'){
        movie["url"] = req.body.movie["url"];
      }
    

      return movie.save(function (err) {
        if (!err) {
          console.log("updated movie");
          return res.status(200).json(movie.toObject());
        } else {
         return res.status(500).json(err);
        }
        return res.status(200).json(movie);
      });
    });

  };

  // DELETE
  api.deleteMovie = function (req, res) {
    var id = req.params.id;
    return Movie.findById(id, function (err, movie) {
      return movie.remove(function (err) {
        if (!err) {
          console.log("removed movie");
          return res.status(204).send();
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    });

  };


  app.get('/api/movies', api.movies);
  app.get('/api/movie/:id', api.movie);
  app.post('/api/movie', api.addMovie);
  app.put('/api/movie/:id', api.editMovie);
  app.delete('/api/movie/:id', api.deleteMovie);
};
