var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var _id = '';


describe('POST New Actor', function(){
  it('creates new actor and responds with json success message', function(done){
    request(app)
    .post('/api/actor')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"actor": {"name":"Two modern buildings that define the southern skyline away from the downtown area are City Hall and the Centennial Pavilion of Vancouver Hospital, both designed by Townley and Matheson in 1936 and 1958 respectively."}})
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

describe('GET List of Actors', function(){
  it('responds with a list of actor items in JSON', function(done){
    request(app)
    .get('/api/actors')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Actor by ID', function(){
  it('responds with a single actor item in JSON', function(done){
    request(app)
    .get('/api/actor/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Actor by ID', function(){
  it('updates actor item in return JSON', function(done){
    request(app)
    .put('/api/actor/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "actor": { "title": "Hell Is Where There Are No Robots" } })
    .expect(200, done);
  });
});

describe('DELETE Actor by ID', function(){
  it('should delete actor and return 200 status code', function(done){
    request(app)
    .del('/api/actor/'+ _id)
    .expect(204, done);
  });
});
