var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var notificationSchema = new Schema({
	'notificationName' : String,
	'notificationBanner' : String,
	'notificationDescription' : String,
	'created_at': String,
	'updated_at': String
});

module.exports = mongoose.model('notification', notificationSchema);
