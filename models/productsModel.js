var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var productsSchema = new Schema({
	'productName' : String,
	'productDescription': String,
	'productImage' : String,
	'productCode' : String,
	'productModel': String,
	'productCountry': String,
	'manfactureDate': String,
	'productCategory' : {
		type: Schema.Types.ObjectId,
		ref: 'category'
   },
	'productBrand'  : {
		type: Schema.Types.ObjectId,
		ref: 'brand'
   },
   'vendor' : String,
   'tags' : Object,
	'todaysDeal' : Boolean,
	'publish' : Boolean,
	'featured' : Boolean,
	'price' : String
});

module.exports = mongoose.model('products', productsSchema);
