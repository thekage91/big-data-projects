module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Genre = mongoose.models.Genre,
      api = {};

  // ALL
  api.genres = function (req, res) {
    Genre.find(function(err, genres) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({genres: genres});
      }
    });
  };

  // GET
  api.genre = function (req, res) {
    var id = req.params.id;
    Genre.findOne({ '_id': id }, function(err, genre) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json({genre: genre});
      }
    });
  };

  // POST
  api.addGenre = function (req, res) {

    var genre;

    if(typeof req.body.genre == 'undefined'){
      res.status(500).json({message: 'genre is undefined'});
    }

    genre = new Genre(req.body.genre);

    genre.save(function (err) {
      if (!err) {
        console.log("created genre");
        return res.status(201).json(genre.toObject());
      } else {
        return res.status(500).json(err);
      }
    });

  };

  // PUT
  api.editGenre = function (req, res) {
    var id = req.params.id;

    Genre.findById(id, function (err, genre) {


    
      if(typeof req.body.genre["Id"] != 'undefined'){
        genre["Id"] = req.body.genre["Id"];
      }
    
      if(typeof req.body.genre["Name"] != 'undefined'){
        genre["Name"] = req.body.genre["Name"];
      }
    

      return genre.save(function (err) {
        if (!err) {
          console.log("updated genre");
          return res.status(200).json(genre.toObject());
        } else {
         return res.status(500).json(err);
        }
        return res.status(200).json(genre);
      });
    });

  };

  // DELETE
  api.deleteGenre = function (req, res) {
    var id = req.params.id;
    return Genre.findById(id, function (err, genre) {
      return genre.remove(function (err) {
        if (!err) {
          console.log("removed genre");
          return res.status(204).send();
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    });

  };


  app.get('/api/genres', api.genres);
  app.get('/api/genre/:id', api.genre);
  app.post('/api/genre', api.addGenre);
  app.put('/api/genre/:id', api.editGenre);
  app.delete('/api/genre/:id', api.deleteGenre);
};
