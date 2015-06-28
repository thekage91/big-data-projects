module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      User = mongoose.models.User,
      api = {};

  // ALL
  api.users = function (req, res) {
    User.find(function(err, users) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({users: users});
      }
    });
  };

  // GET
  api.user = function (req, res) {
    var id = req.params.id;
    User.findOne({ '_id': id }, function(err, user) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json({user: user});
      }
    });
  };

  // POST
  api.addUser = function (req, res) {

    var user;

    if(typeof req.body.user == 'undefined'){
      res.status(500).json({message: 'user is undefined'});
    }

    user = new User(req.body.user);

    user.save(function (err) {
      if (!err) {
        console.log("created user");
        return res.status(201).json(user.toObject());
      } else {
        return res.status(500).json(err);
      }
    });

  };

  // PUT
  api.editUser = function (req, res) {
    var id = req.params.id;

    User.findById(id, function (err, user) {


    
      if(typeof req.body.user["Id"] != 'undefined'){
        user["Id"] = req.body.user["Id"];
      }
    
      if(typeof req.body.user["Age"] != 'undefined'){
        user["Age"] = req.body.user["Age"];
      }
    
      if(typeof req.body.user["Gender"] != 'undefined'){
        user["Gender"] = req.body.user["Gender"];
      }
    
      if(typeof req.body.user["Zip"] != 'undefined'){
        user["Zip"] = req.body.user["Zip"];
      }
    

      return user.save(function (err) {
        if (!err) {
          console.log("updated user");
          return res.status(200).json(user.toObject());
        } else {
         return res.status(500).json(err);
        }
        return res.status(200).json(user);
      });
    });

  };

  // DELETE
  api.deleteUser = function (req, res) {
    var id = req.params.id;
    return User.findById(id, function (err, user) {
      return user.remove(function (err) {
        if (!err) {
          console.log("removed user");
          return res.status(204).send();
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    });

  };


  app.get('/api/users', api.users);
  app.get('/api/user/:id', api.user);
  app.post('/api/user', api.addUser);
  app.put('/api/user/:id', api.editUser);
  app.delete('/api/user/:id', api.deleteUser);
};
