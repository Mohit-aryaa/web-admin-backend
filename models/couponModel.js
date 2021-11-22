var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var couponSchema = new Schema({
	'title' : String,
	'validFrom' : String,
	'validTill' : String,
	'discountOn' : String,
	'discountOnField' : Object,
	'couponCode' : String,
	'discountType' : String,
	'discountValue' : String,
	'customerGroup' : String,
	'deviceType' : String,
	'paymentType' : String,
	'cartAmount' : String,
	'maxDiscount' : String,
	'usePerCoupon' : String,
	'couponDescription' : String,
	'publish': Boolean,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('coupon', couponSchema);
