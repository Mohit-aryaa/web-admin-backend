var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var productsSchema = new Schema({
	'productName' : String,
	'productDescription': String,
	'productImages' : Array,
	'productSku' : String,
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
	'productSubChildCategory' : {
		type: Schema.Types.ObjectId,
		ref: 'subChildCategory'
	},
	'productBrand'  : {
		type: Schema.Types.ObjectId,
		ref: 'brand'
   },
   'vendor': {
		type: Schema.Types.ObjectId,
		ref: 'vendor'
	},
	'unit': String,
	'dimensions': Object,
	'weight': String,
   'tags' : Object,
   'isBundle': Boolean,
	'todaysDeal' : Boolean,
	'publish' : Boolean,
	'featured' : Boolean,
	'price' : String,
	'mrp' : String,
	'purchasePrice': String,
	'shippingCost': String,
	'productTax': String,
	'productDiscount': String,
	'maxQuantity': String,
	'minimumQuantity': String,
	'customersOptions': Object,
	'seoKeyWords': String,
	'metaTagKeywords': String,
	'metaTagDescription': String,
	'metaTagTitle': String,
	'imageAltTag': String,
	'seoUrl' : String,
	'youtubeVideoId' : String,
	'question': Object,
	'answer': String,
	'blogPost': Object,
	'similarProduct': Object,
	'delivery':  Object,
	'bulkDiscount' : Object,
	'cashBack' : Object,
	'variant' : String,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('products', productsSchema);
