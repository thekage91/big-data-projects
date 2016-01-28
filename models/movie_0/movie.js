'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

/*var fields = {
    first_name:String ,
    last_name: String
};

var directorSchema = new Schema(fields, {_id: false});
*/
var fields = {
	title: { type: String, trim: true, required: true},
	release_date: { type: String },
	writer: { type: String },
	stars: { type: String },
	ratings: { type: String },
	certificate: { type: String },
	country: { type: String },
	writers: { type: String },
	distributors: { type: String },
    genres : [{
        name: { type: String}}],
    actors : [{
        first_name:String ,
        last_name: String }],
    directors : [{
        first_name:String ,
        last_name: String
    }]
};

var movieSchema = new Schema(fields);



module.exports = mongoose.model('Movie0', movieSchema);
