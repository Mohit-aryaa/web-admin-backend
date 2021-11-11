var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionsSchema = new Schema({
	'question' : String,
	'product' : Object,
	'answer' : String,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('questions', questionsSchema);
