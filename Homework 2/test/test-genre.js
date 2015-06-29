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
    .send({"genre": {&#34;name&#34;:&#34;Rejections of candidates by the Provost continued, fueling discontent among the Fellows, until a writ of attachment against the Bishop of Lincoln was heard between 1724 and 1726.&#34;}})
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