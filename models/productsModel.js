var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var productsSchema = new Schema({
	'productName' : String,
	'productDescription': String,
	'productImages' : Array,
	'productCode' : String,
	'productModel': String,
	'productCountry': String,
	'manfactureDate': String,
	'stock': Number,
	'productCategory' : {
		type: Schema.Types.ObjectId,
		ref: 'category'
   },
   'productSubCategory' : {
		type: Schema.Types.ObjectId,
		ref: 'subCategory'
	},
	'productBrand'  : {
		type: Schema.Types.ObjectId,
		ref: 'brand'
   },
   'vendor': {
		type: Schema.Types.ObjectId,
		ref: 'vendor'
	},
   'tags' : Object,
   'isBundle': Boolean,
	'todaysDeal' : Boolean,
	'publish' : Boolean,
	'featured' : Boolean,
	'price' : String,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('products', productsSchema);
