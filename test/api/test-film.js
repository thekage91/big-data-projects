var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var _id = '';


describe('POST New Film', function(){
  it('creates new film and responds with json success message', function(done){
    request(app)
    .post('/api/film')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"film": {"title":"In 2008, the association had 95,877 uniformed members, with approximately 2700 Scout groups in the sections Grasshopper Scouts, Cubs, Scouts, Venture and Rover Scouts, making it the largest uniformed youth organisation in Hong Kong.","release_date":"1985-03-26T07:21:31.128Z","writer":"In 1659, while attempting to seduce her, James promised he would marry Anne.","stars":"Initially admitted to the 3rd Field Ambulance, the injury necessitated treatment in England and Whittle was transferred to the 1st Auxiliary Hospital, Harefield.","ratings":"A similar attack was more successful on the right \"Honeysucle\" flank, though only briefly and late in the fight.","actors":"James's Palace in London on 14 October 1633.","certificate":"Some later medieval historians also used the Chronicle, and others took their material from those who had used it, and so the Chronicle became \"central to the mainstream of English historical tradition\".","county":"Eastern populations in Andringitra incorporate the widest recorded variety of prey, including both vertebrates and invertebrates.","writers":"The following year he was attached to the Air Ministry in London.","distributors":"The 1949 Ambato earthquake was the largest earthquake in the Western Hemisphere in more than five years."}})
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
