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
	'price' : String,
	'stock': Number,
	'productModel' : String,
	'productSku' : String,
	'tags' : Object,
	'productCountry': String,
    'manfactureDate': String,
	'productDescription' : String,
	'isBundle': Boolean,
	'todaysDeal': Boolean,
	'publish': Boolean,
	'featured': Boolean,
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

module.exports = mongoose.model('bundleProduct', bundleProductSchema);
