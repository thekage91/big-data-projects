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
    .send({"film": {&#34;title&#34;:&#34;Hetti Perkins and Margie West have suggested that in paintings by Kintore women artists such as Wintjiya and Tjunkiya, \&#34;the viscosity of the painting&#39;s surface seems to mimic the generous application of body paint in women&#39;s ceremonies\&#34;.&#34;,&#34;release_date&#34;:&#34;1984-11-21T11:09:13.975Z&#34;,&#34;writer&#34;:&#34;Using his bombs, he succeeded in killing the entire group before collecting the gun and taking it back to A Company&#39;s position.&#34;,&#34;stars&#34;:&#34;It has medium brown eyes set relatively wide apart with pupils that contract to slits.&#34;,&#34;ratings&#34;:&#34;One attendee was horrified on discovering that they were dancing in the same social set as their grocer.&#34;,&#34;actors&#34;:&#34;The fruits of choice in the south were lemons, citrons, bitter oranges (the sweet type was not introduced until several hundred years later), pomegranates, quinces, and, of course, grapes.&#34;,&#34;certificate&#34;:&#34;The losses of the cavalry were heavy and the effect of its attack completely null.&#34;,&#34;country&#34;:&#34;The Lakers took a 3–2 lead in the series, but Abdul-Jabbar, who averaged 33 points a game in the series, sprained his ankle in Game 5 and could not play in Game 6.&#34;,&#34;writers&#34;:&#34;She is the sister of artist Tjunkiya Napaltjarri; both were wives of Toba Tjakamarra, with whom Wintjiya had five children.&#34;,&#34;distributors&#34;:&#34;In response of this movement, the Portuguese army inverted its dispositions and headed to the South slope of the hill.&#34;}})
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