var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var consultantSchema = new Schema({
	'logo' : String,
	'displayName' : String,
	'name' : String, 
	'email' : String,
	'phone' : String,
	'company' : Object,
	'address' : Object,
	'bankAccountType': String,
	'bankAccountName' : String,
	'bankAccountDetails': Object,
	'panNumber': String,
	'gstNumber': String,
	'memberShip': String,
	'status' : String,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('consultant', consultantSchema);
