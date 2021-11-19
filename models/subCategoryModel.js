var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var subCategorySchema = new Schema({
	'subCategoryName' : String,
	'category' : {
		type: Schema.Types.ObjectId,
		ref: 'category'
   },
   'subCategoryBanner' : String,
	'metaTitle': String,
	'metaDescription': String,
	'seoUrl': String,
	'subCategoryDescription' : String,
   'created_at': String,
   'updated_at': String
});

module.exports = mongoose.model('subCategory', subCategorySchema);
