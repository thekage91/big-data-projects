module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Director = mongoose.models.Director,
      api = {};

  // ALL
  api.directors = function (req, res) {
    Director.find(function(err, directors) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({directors: directors});
      }
    });
  };

  // GET
  api.director = function (req, res) {
    var id = req.params.id;
    Director.findOne({ '_id': id }, function(err, director) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json({director: director});
      }
    });
  };

  // POST
  api.addDirector = function (req, res) {

    var director;

    if(typeof req.body.director == 'undefined'){
      res.status(500).json({message: 'director is undefined'});
    }

    director = new Director(req.body.director);

    director.save(function (err) {
      if (!err) {
        console.log("created director");
        return res.status(201).json(director.toObject());
      } else {
        return res.status(500).json(err);
      }
    });

  };

  // PUT
  api.editDirector = function (req, res) {
    var id = req.params.id;

    Director.findById(id, function (err, director) {


    
      if(typeof req.body.director["name"] != 'undefined'){
        director["name"] = req.body.director["name"];
      }
    

      return director.save(function (err) {
        if (!err) {
          console.log("updated director");
          return res.status(200).json(director.toObject());
        } else {
         return res.status(500).json(err);
        }
        return res.status(200).json(director);
      });
    });

  };

  // DELETE
  api.deleteDirector = function (req, res) {
    var id = req.params.id;
    return Director.findById(id, function (err, director) {
      return director.remove(function (err) {
        if (!err) {
          console.log("removed director");
          return res.status(204).send();
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    });

  };


  app.get('/api/directors', api.directors);
  app.get('/api/director/:id', api.director);
  app.post('/api/director', api.addDirector);
  app.put('/api/director/:id', api.editDirector);
  app.delete('/api/director/:id', api.deleteDirector);
};
