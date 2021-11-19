var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var categorySchema = new Schema({
	'categoryName' : String,
	'categoryBanner' : String,
	'metaTitle': String,
	'metaDescription': String,
	'seoUrl': String,
	'categoryDescription' : String,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('category', categorySchema);
