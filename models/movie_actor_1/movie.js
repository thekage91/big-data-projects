'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	title: { type: String ,unique: true,trim: true},
	release_date: { type: Number , default: Date.now },
	writer: { type: String },
	stars: { type: String },
	ratings: { type: String },
	certificate: { type: String },
	country: { type: String },
	writers: { type: String },
	distributors: { type: String },
    genres : [{ type: String }],
    directors : [{ type: String }],
    actors : [{ type: Schema.Types.ObjectId, ref: 'Actor' }]
};

var movieSchema = new Schema(fields);

module.exports = mongoose.model('Movie1', movieSchema);
