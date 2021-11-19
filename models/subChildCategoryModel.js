var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var subChildCategorySchema = new Schema({
	'subChildCategoryName' : String,
	'category' : {
		type: Schema.Types.ObjectId,
		ref: 'category'
   },
   'subCategory' : {
		type: Schema.Types.ObjectId,
		ref: 'subCategory'
	},
   'subChildCategoryBanner' : String,
	'metaTitle': String,
	'metaDescription': String,
	'seoUrl': String,
	'subChildCategoryDescription' : String,
   'created_at': String,
   'updated_at': String
});

module.exports = mongoose.model('subChildCategory', subChildCategorySchema);
