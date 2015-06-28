'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Age: { type: Number },
	Gender: { type: String },
	Zip: { type: Number }
};

var userSchema = new Schema(fields);

module.exports = mongoose.model('User', userSchema);
