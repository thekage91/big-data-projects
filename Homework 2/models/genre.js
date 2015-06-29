'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String }
};

var genreSchema = new Schema(fields);

module.exports = mongoose.model('Genre', genreSchema);
