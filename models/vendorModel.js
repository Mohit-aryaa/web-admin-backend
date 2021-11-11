var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var vendorSchema = new Schema({
	'name' : String,
	'status' : Boolean,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('vendor', vendorSchema);
