'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	first_name: { type: String },
    last_name: String,
    movies : [{ type: Schema.Types.ObjectId, ref: 'Movie6' }]
};

var directorSchema = new Schema(fields);

module.exports = mongoose.model('Director6', directorSchema);
