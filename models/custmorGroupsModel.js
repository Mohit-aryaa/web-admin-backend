var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CustmorGroups = new Schema({
	'groupId' : String,
	'groupName' : String,
	'status' : Boolean,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('Custmor-Groups', CustmorGroups);