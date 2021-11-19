var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var vendorSchema = new Schema({
	'name' : String,
	'addressLine1': String,
	'addressLine2': String,
	'city': String,
	'state': String,
	'country': String,
	'zip': String,
	'company': Object,
	'bankAccountType': String,
	'bankAccountName' : String,
	'bankAccountDetails': Object,
	'panNumber': String,
	'gstNumber': String,
	'memberShip': String,
	'phone': String,
	'email': String,
	'password' : String,
	'active' : Boolean,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('vendor', vendorSchema);
