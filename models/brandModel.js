var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var brandSchema = new Schema({
	'brandName' : String,
	'brandDescription' : String,
	'brandBanner' : String,
	'metaTitle': String,
	'metaDescription': String,
	'seoUrl': String,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('brand', brandSchema);
