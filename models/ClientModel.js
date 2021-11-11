var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ClientSchema = new Schema({
	'name' : String,
	'role' : Number,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('Client', ClientSchema);
