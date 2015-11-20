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

module.exports.fakeDirector = function () {
    return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        movies: []
    }
}

module.exports.fakeGenre = function () {
    return {
        name: faker.name.firstName(),
        movies: []
    }
}

module.exports.sameMovie = function () {
    return {
        title: 'Matrix',
        release_date: 'Tue Nov 17 2015 14:24:27 GMT+0100 (CET)',
        writer: 'Lana & Andy Wachowski',
        stars: 5,
        ratings: '5',
        certificate: 'PEGI5',
        country: 'Italy',
        writers:  'Ciccio Paduccio',
        distributors: 'SONY',
        genres : [],
        directors : [],
        actors : []
    }
}

module.exports.sameActor = function () {
    return {
        first_name: 'Keanu',
        last_name: 'Reeves',
        movies: []
    }
}

module.exports.sameDirector = function () {
    return {
        first_name: 'Woody',
        last_name: 'Allen',
        movies: []
    }
}

module.exports.sameGenre = function () {
    return {
        name: 'Horror',
        movies: []
    }
}


//console.log(module.exports.fakeMovie());


/*
 var fields = {
 name: { type: String,unique: true },
 movies : [{ type: Schema.Types.ObjectId, ref: 'Movie4' }]
 };


 var fields = {
 first_name: { type: String },
 last_name: String,
 movies : [{ type: Schema.Types.ObjectId, ref: 'Movie2' }]
 };

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
