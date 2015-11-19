'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	title: { type: String ,unique: true,trim: true},
	release_date: { type: Date , default: Date.now },
	writer: { type: String },
	stars: { type: String },
	ratings: { type: String },
	certificate: { type: String },
	country: { type: String },
	writers: { type: String },
	distributors: { type: String },
    genres : [{ type: String }],
    directors : [{ type: Schema.Types.ObjectId, ref: 'Director2' }],
    actors : [{ type: Schema.Types.ObjectId, ref: 'Actor2' }]
};

var movieSchema = new Schema(fields);

module.exports = mongoose.model('Movie2', movieSchema);
