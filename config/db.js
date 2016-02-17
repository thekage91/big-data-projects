'use strict';
var mongoose = require('mongoose');

var db_name;
if(process.env.NODE_ENV === 'test')
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

var config_cluster = {
    "db": 'imdb-nosql',
    "host1": "bigdata-cluster-0.bigdataproject.5682.mongodbdns.com",
    "host2": 'bigdata-cluster-1.bigdataproject.5682.mongodbdns.com',
    "host3": 'bigdata-cluster-2.bigdataproject.5682.mongodbdns.com',
    "user": "admin",
    "pw": "ciaociao",
    "port": 27000,
    "rSet": 'imdb_0'
};

// mongodb://[<username>:<password>@]hostname0<:port>[,hostname1:<port1>][,hostname2:<port2>][...][,hostnameN:<portN>]

var port = (config.port.length > 0) ? ":" + config.port : '';
var login = (config.user.length > 0) ? config.user + ":" + config.pw + "@" : '';
var uristring =  "mongodb://" + login + config.host + port + "/" + config.db;

var login_cluster = config_cluster.user + ":" + config_cluster.pw + "@";
var uristring_cluster =  `mongodb://${login_cluster}${config_cluster.host1}:${config_cluster.port},`+
`${config_cluster.host2}:${config_cluster.port},`+
`${config_cluster.host3}:${config_cluster.port}/${config_cluster.db}?replicaSet=${config_cluster.rSet}&connectTimeoutMS=300000`;

var mongoOptions = { db: { safe: true } };
//var mongoOptions = {};
// Connect to Database
<<<<<<< HEAD
console.log('connecting to: ' + uristring);

//Usare variabile uristring_cluster per il cluster online
//oppure uristring in locale
mongoose.connect(uristring, mongoOptions, function (err, res) {
=======
var connection_2_db = mongoose.connect(uristring, mongoOptions, function (err, res) {
>>>>>>> dev-parsing
  if(err){
    console.log('ERROR connecting to: ' + uristring_cluster + '. ' + err);
  }else{
    console.log('Successfully connected to: ' + uristring_cluster);
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
