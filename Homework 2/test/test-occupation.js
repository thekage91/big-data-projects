var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New Occupation', function(){
  it('creates new occupation and responds with json success message', function(done){
    request(app)
    .post('/api/occupation')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"occupation": {"Id":"He vowed to move to Taganrog as soon as a water supply was installed there.","Name":"In these years Louise and her husband were closer than they had been before."}})
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

describe('GET List of Occupations', function(){
  it('responds with a list of occupation items in JSON', function(done){
    request(app)
    .get('/api/occupations')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Occupation by ID', function(){
  it('responds with a single occupation item in JSON', function(done){
    request(app)
    .get('/api/occupation/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Occupation by ID', function(){
  it('updates occupation item in return JSON', function(done){
    request(app)
    .put('/api/occupation/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "occupation": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE Occupation by ID', function(){
  it('should delete occupation and return 200 status code', function(done){
    request(app)
    .del('/api/occupation/'+ _id) 
    .expect(204, done);
  });
});