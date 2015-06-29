var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New Film', function(){
  it('creates new film and responds with json success message', function(done){
    request(app)
    .post('/api/film')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"film": {}})
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

describe('GET List of Films', function(){
  it('responds with a list of film items in JSON', function(done){
    request(app)
    .get('/api/films')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Film by ID', function(){
  it('responds with a single film item in JSON', function(done){
    request(app)
    .get('/api/film/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Film by ID', function(){
  it('updates film item in return JSON', function(done){
    request(app)
    .put('/api/film/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "film": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE Film by ID', function(){
  it('should delete film and return 200 status code', function(done){
    request(app)
    .del('/api/film/'+ _id) 
    .expect(204, done);
  });
});