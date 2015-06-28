module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Occupation = mongoose.models.Occupation,
      api = {};

  // ALL
  api.occupations = function (req, res) {
    Occupation.find(function(err, occupations) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({occupations: occupations});
      }
    });
  };

  // GET
  api.occupation = function (req, res) {
    var id = req.params.id;
    Occupation.findOne({ '_id': id }, function(err, occupation) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json({occupation: occupation});
      }
    });
  };

  // POST
  api.addOccupation = function (req, res) {

    var occupation;

    if(typeof req.body.occupation == 'undefined'){
      res.status(500).json({message: 'occupation is undefined'});
    }

    occupation = new Occupation(req.body.occupation);

    occupation.save(function (err) {
      if (!err) {
        console.log("created occupation");
        return res.status(201).json(occupation.toObject());
      } else {
        return res.status(500).json(err);
      }
    });

  };

  // PUT
  api.editOccupation = function (req, res) {
    var id = req.params.id;

    Occupation.findById(id, function (err, occupation) {


    
      if(typeof req.body.occupation["Id"] != 'undefined'){
        occupation["Id"] = req.body.occupation["Id"];
      }
    
      if(typeof req.body.occupation["Name"] != 'undefined'){
        occupation["Name"] = req.body.occupation["Name"];
      }
    

      return occupation.save(function (err) {
        if (!err) {
          console.log("updated occupation");
          return res.status(200).json(occupation.toObject());
        } else {
         return res.status(500).json(err);
        }
        return res.status(200).json(occupation);
      });
    });

  };

  // DELETE
  api.deleteOccupation = function (req, res) {
    var id = req.params.id;
    return Occupation.findById(id, function (err, occupation) {
      return occupation.remove(function (err) {
        if (!err) {
          console.log("removed occupation");
          return res.status(204).send();
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    });

  };


  app.get('/api/occupations', api.occupations);
  app.get('/api/occupation/:id', api.occupation);
  app.post('/api/occupation', api.addOccupation);
  app.put('/api/occupation/:id', api.editOccupation);
  app.delete('/api/occupation/:id', api.deleteOccupation);
};
