var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var bundleProductSchema = new Schema({
	'productName' : String,
	'products' :  {
		type: Schema.Types.Array,
		ref: 'products'
   },
	'productImages' : Array,
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
	'price' : String,
	'stock': Number,
	'productModel' : String,
	'productCode' : String,
	'tags' : Object,
	'productDescription' : String,
	'isBundle': Boolean,
	'todaysDeal': Boolean,
	'publish': Boolean,
	'featured': Boolean,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('bundleProduct', bundleProductSchema);
