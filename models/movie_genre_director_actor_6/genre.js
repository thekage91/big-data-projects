"use strict";

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	name: { type: String,unique: true },
    movies : [{ type: Schema.Types.ObjectId, ref: 'Movie6' }]
};

var genreSchema = new Schema(fields);

module.exports = mongoose.model('Genre6', genreSchema);
