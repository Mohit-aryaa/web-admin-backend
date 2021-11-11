var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var shippingSchema = new Schema({
	'shippingCost' : Number,
	'shippingFrom' : Number,
	'shippingTo' : Number,
	'shippingTime' : String,
	'minimumOrder' : Number,
	'prePaid' : Boolean,
	'postPaid' : Boolean,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('shipping', shippingSchema);
