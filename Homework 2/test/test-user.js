var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New User', function(){
  it('creates new user and responds with json success message', function(done){
    request(app)
    .post('/api/user')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"user": {"Id":"Peter's Monastery in Gloucester names two other women, Eadburh and Eafe, as queens of Wulfhere, but neither claim is plausible.","Age":-25.13966024853289,"Gender":"(5) William Smith (Bishop of Lincoln) who gave property for a Fellowship around 1508.","Zip":85.49925638362765}})
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

describe('GET List of Users', function(){
  it('responds with a list of user items in JSON', function(done){
    request(app)
    .get('/api/users')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET User by ID', function(){
  it('responds with a single user item in JSON', function(done){
    request(app)
    .get('/api/user/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT User by ID', function(){
  it('updates user item in return JSON', function(done){
    request(app)
    .put('/api/user/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "user": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE User by ID', function(){
  it('should delete user and return 200 status code', function(done){
    request(app)
    .del('/api/user/'+ _id) 
    .expect(204, done);
  });
});