var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';


describe('POST New Director', function(){
  it('creates new director and responds with json success message', function(done){
    request(app)
    .post('/api/director')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"director": {"name":"Stephen of Ripon's Life of Wilfrid describes Wulfhere as \"a man of proud mind, and insatiable will\"."}})
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

describe('GET List of Directors', function(){
  it('responds with a list of director items in JSON', function(done){
    request(app)
    .get('/api/directors')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Director by ID', function(){
  it('responds with a single director item in JSON', function(done){
    request(app)
    .get('/api/director/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Director by ID', function(){
  it('updates director item in return JSON', function(done){
    request(app)
    .put('/api/director/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "director": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(200, done);
  });
});

describe('DELETE Director by ID', function(){
  it('should delete director and return 200 status code', function(done){
    request(app)
    .del('/api/director/'+ _id) 
    .expect(204, done);
  });
});