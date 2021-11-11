var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var subCategorySchema = new Schema({
	'subCategoryName' : String,
	'subCategoryDescription' : String,
	'category' : {
		type: Schema.Types.ObjectId,
		ref: 'category'
   },
   'created_at': String,
   'updated_at': String
});

module.exports = mongoose.model('subCategory', subCategorySchema);
