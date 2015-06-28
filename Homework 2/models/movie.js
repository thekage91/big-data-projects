'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Title: { type: String },
	Release_date: { type: String },
	Video_release_date: { type: String },
	Url: { type: String }
};

var movieSchema = new Schema(fields);

module.exports = mongoose.model('Movie', movieSchema);
