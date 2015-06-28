var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New Genre', function(){
  it('creates new genre and responds with json success message', function(done){
    request(app)
    .post('/api/genre')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"genre": {"Id":"Since the 1970s Wintjiya had created artefacts such as ininti seed necklaces, mats and baskets, using traditional artistic techniques including weaving of spinifex grass.","Name":"On either side are portraits of Sir Walter Raleigh and Joseph Butler."}})
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

describe('GET List of Genres', function(){
  it('responds with a list of genre items in JSON', function(done){
    request(app)
    .get('/api/genres')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Genre by ID', function(){
  it('responds with a single genre item in JSON', function(done){
    request(app)
    .get('/api/genre/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Genre by ID', function(){
  it('updates genre item in return JSON', function(done){
    request(app)
    .put('/api/genre/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "genre": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE Genre by ID', function(){
  it('should delete genre and return 200 status code', function(done){
    request(app)
    .del('/api/genre/'+ _id) 
    .expect(204, done);
  });
});