'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	first_name: { type: String },
    last_name: { type: String },
    movies : [{ type: Schema.Types.ObjectId, ref: 'Movie6' }]
};

var actorSchema = new Schema(fields);

module.exports = mongoose.model('Actor6', actorSchema);
