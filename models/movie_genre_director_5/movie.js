'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
<<<<<<< HEAD:models/movie_genre_director_5/movie.js
	title: { type: String ,unique: true,trim: true},
	release_date: { type: Date , default: Date.now },
=======
	title: { type: String ,unique: true, trim: true},
	//release_date: { type: Number , default: Date.now },
	release_date: { type: String },
>>>>>>> dev-parsing:models/movie.js
	writer: { type: String },
	stars: { type: String },
	ratings: { type: String },
	certificate: { type: String },
	country: { type: String },
	writers: { type: String },
	distributors: { type: String },
    genres : [{ type: Schema.Types.ObjectId, ref: 'Genre5' }],
    directors : [{ type: Schema.Types.ObjectId, ref: 'Director5' }],
    actors : [{ type: String }]
};

var movieSchema = new Schema(fields);

module.exports = mongoose.model('Movie5', movieSchema);
