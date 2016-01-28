'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	title: { type: String ,trim: true},
	release_date: { type: Date , default: Date.now },
	writer: { type: String },
	stars: { type: String },
	ratings: { type: String },
	certificate: { type: String },
	country: { type: String },
	writers: { type: String },
	distributors: { type: String },
    genres : [{ type: Schema.Types.ObjectId, ref: 'Genre4' }],
    actors : [{
        first_name:String ,
        last_name: String }],
    directors : [{
        first_name:String ,
        last_name: String }]
};

var movieSchema = new Schema(fields);

module.exports = mongoose.model('Movie4', movieSchema);
