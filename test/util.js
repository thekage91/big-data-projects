/**
 * Created by ugo on 14/11/15.
 */
var faker = require('faker');

module.exports.fakeMovie = function () {
    return {
        title: faker.company.companyName(),
        release_date: faker.date.recent(),
        writer: faker.name.findName(),
        stars: faker.random.number(),
        ratings: faker.name.findName(),
        certificate: faker.lorem.words(),
        country: faker.address.country(),
        writers:  faker.lorem.words(),
        distributors: faker.lorem.words(),
        genres : [],
        directors : [],
        actors : []
    }
}

module.exports.fakeActor = function () {
    return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        movies: []
    }
}


//console.log(module.exports.fakeMovie());


/*
 var fields = {
 title: { type: String ,unique: true,trim: true},
 release_date: { type: Number , default: Date.now },
 writer: { type: String },
 stars: { type: String },
 ratings: { type: String },
 certificate: { type: String },
 county: { type: String },
 writers: { type: String },
 distributors: { type: String },
 genres : [{ type: String }],
 directors : [{ type: String }],
 actors : [{ type: String }]
 };

 */
