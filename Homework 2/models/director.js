'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String }
};

var directorSchema = new Schema(fields);

module.exports = mongoose.model('Director', directorSchema);
