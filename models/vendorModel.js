var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var vendorSchema = new Schema({
	'name' : String,
	'status' : Boolean
});

module.exports = mongoose.model('vendor', vendorSchema);
