'use strict';
var mongoose = require('mongoose');

var db_name;
if(process.env.NODE_ENV == 'test')
    db_name = 'imdb-nosql-test'
else
    db_name = 'imdb-nosql'

var config = {
  "db": db_name,
  "host": "localhost",
  "user": "",
  "pw": "",
  "port": 27017
};

var port = (config.port.length > 0) ? ":" + config.port : '';
var login = (config.user.length > 0) ? config.user + ":" + config.pw + "@" : '';
var uristring =  "mongodb://" + login + config.host + port + "/" + config.db;

var mongoOptions = { db: { safe: true } };

// Connect to Database
var connection_2_db = mongoose.connect(uristring, mongoOptions, function (err, res) {
  if(err){
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  }else{
    console.log('Successfully connected to: ' + uristring);
  }
});

/*
connection_2_db.db.dropDatabase();

mongoose.connect(uristring, mongoOptions, function (err, res) {
  if(err){
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  }else{
    console.log('Successfully connected to: ' + uristring);
  }
});
*/

exports.mongoose = mongoose;
