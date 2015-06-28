var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New Movie', function(){
  it('creates new movie and responds with json success message', function(done){
    request(app)
    .post('/api/movie')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"movie": {"id":"Other streets are lined with flowering chestnut, horse chestnut and other decorative shade trees.","title":"When Louise offered to continue the ironing, the woman refused, adding that she was in a great hurry to finish so that she could go and see Princess Louise.","release-date":"1 mi) per day, although in one reported case a fossa was observed moving a straight-line distance of 7 km (4.","video-release-date":"Marzipan in many forms was well known in Italy and southern France by the 1340s and is assumed to be of Arab origin.","url":"Five different scribes can be identified for the entries up to 1054, after which it appears to have been worked on at intervals."}})
    .expect(201)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      _id = res.body._id;
      done();
    });
  });
});

describe('GET List of Movies', function(){
  it('responds with a list of movie items in JSON', function(done){
    request(app)
    .get('/api/movies')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Movie by ID', function(){
  it('responds with a single movie item in JSON', function(done){
    request(app)
    .get('/api/movie/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Movie by ID', function(){
  it('updates movie item in return JSON', function(done){
    request(app)
    .put('/api/movie/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "movie": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE Movie by ID', function(){
  it('should delete movie and return 200 status code', function(done){
    request(app)
    .del('/api/movie/'+ _id) 
    .expect(204, done);
  });
});