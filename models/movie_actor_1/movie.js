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
    genres : [{
        name: { type: String }}],
    directors : [{
        first_name:String ,
        last_name: String }],
    actors : [{ type: Schema.Types.ObjectId, ref: 'Actor1' ,unique: true}]
};

var movieSchema = new Schema(fields);

module.exports = mongoose.model('Movie1', movieSchema);
