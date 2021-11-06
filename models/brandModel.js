var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var brandSchema = new Schema({
	'brandName' : String,
	'brandDescription' : String
});

module.exports = mongoose.model('brand', brandSchema);
