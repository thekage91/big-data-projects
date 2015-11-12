module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Actor = mongoose.models.Actor,
      api = {};

  // ALL
  api.actors = function (req, res) {
    Actor.find(function(err, actors) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({actors: actors});
      }
    });
  };

  // GET
  api.actor = function (req, res) {
    var id = req.params.id;
    Actor.findOne({ '_id': id }, function(err, actor) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json({actor: actor});
      }
    });
  };

  // POST
  api.addActor = function (req, res) {

    var actor;

    if(typeof req.body.actor == 'undefined'){
      res.status(500).json({message: 'actor is undefined'});
    }

    actor = new Actor(req.body.actor);

    actor.save(function (err) {
      if (!err) {
        console.log("created actor");
        return res.status(201).json(actor.toObject());
      } else {
        return res.status(500).json(err);
      }
    });

  };

  // PUT
  api.editActor = function (req, res) {
    var id = req.params.id;

    Actor.findById(id, function (err, actor) {


    
      if(typeof req.body.actor["name"] != 'undefined'){
        actor["name"] = req.body.actor["name"];
      }
    

      return actor.save(function (err) {
        if (!err) {
          console.log("updated actor");
          return res.status(200).json(actor.toObject());
        } else {
         return res.status(500).json(err);
        }
        return res.status(200).json(actor);
      });
    });

  };

  // DELETE
  api.deleteActor = function (req, res) {
    var id = req.params.id;
    return Actor.findById(id, function (err, actor) {
      return actor.remove(function (err) {
        if (!err) {
          console.log("removed actor");
          return res.status(204).send();
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    });

  };


  app.get('/api/actors', api.actors);
  app.get('/api/actor/:id', api.actor);
  app.post('/api/actor', api.addActor);
  app.put('/api/actor/:id', api.editActor);
  app.delete('/api/actor/:id', api.deleteActor);
};
