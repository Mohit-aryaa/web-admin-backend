var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var subCategorySchema = new Schema({
	'subCategoryName' : String,
	'subCategoryDescription' : String,
	'category': String
});

module.exports = mongoose.model('subCategory', subCategorySchema);
