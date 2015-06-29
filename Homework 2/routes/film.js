// Module dependencies.
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Film = mongoose.models.Film,
    api = {};

// ALL
api.films = function (req, res) {
  Film.find(function(err, films) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json({films: films});
    }
  });
};

// GET
api.film = function (req, res) {
  var id = req.params.id;
  Film.findOne({ '_id': id }, function(err, film) {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json({film: film});
    }
  });
};

// POST
api.addFilm = function (req, res) {

  var film;

  if(typeof req.body.film == 'undefined'){
    res.status(500).json({message: 'film is undefined'});
  }

  film = new Film(req.body.film);

  film.save(function (err) {
    if (!err) {
      console.log("created film");
      return res.status(201).json(film.toObject());
    } else {
      return res.status(500).json(err);
    }
  });

};

// PUT
api.editFilm = function (req, res) {
  var id = req.params.id;

  Film.findById(id, function (err, film) {


  
    if(typeof req.body.film["title"] != 'undefined'){
      film["title"] = req.body.film["title"];
    }
  
    if(typeof req.body.film["release_date"] != 'undefined'){
      film["release_date"] = req.body.film["release_date"];
    }
  
    if(typeof req.body.film["writer"] != 'undefined'){
      film["writer"] = req.body.film["writer"];
    }
  
    if(typeof req.body.film["stars"] != 'undefined'){
      film["stars"] = req.body.film["stars"];
    }
  
    if(typeof req.body.film["ratings"] != 'undefined'){
      film["ratings"] = req.body.film["ratings"];
    }
  
    if(typeof req.body.film["actors"] != 'undefined'){
      film["actors"] = req.body.film["actors"];
    }
  
    if(typeof req.body.film["certificate"] != 'undefined'){
      film["certificate"] = req.body.film["certificate"];
    }
  
    if(typeof req.body.film["country"] != 'undefined'){
      film["country"] = req.body.film["country"];
    }
  
    if(typeof req.body.film["writers"] != 'undefined'){
      film["writers"] = req.body.film["writers"];
    }
  
    if(typeof req.body.film["distributors"] != 'undefined'){
      film["distributors"] = req.body.film["distributors"];
    }
  

    return film.save(function (err) {
      if (!err) {
        console.log("updated film");
        return res.status(200).json(film.toObject());
      } else {
       return res.status(500).json(err);
      }
      return res.status(200).json(film);
    });
  });

};

// DELETE
api.deleteFilm = function (req, res) {
  var id = req.params.id;
  return Film.findById(id, function (err, film) {
    return film.remove(function (err) {
      if (!err) {
        console.log("removed film");
        return res.status(204).send();
      } else {
        console.log(err);
        return res.status(500).json(err);
      }
    });
  });

};


router.get('/films', api.films);
router.post('/film', api.addFilm);

router.route('/film/:id')
  .get(api.film)
  .put(api.editFilm)
  .delete(api.deleteFilm);


module.exports = router;
