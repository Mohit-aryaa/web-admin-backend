var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ClientSchema = new Schema({
	'name' : String,
	'role' : Number
});

module.exports = mongoose.model('Client', ClientSchema);
