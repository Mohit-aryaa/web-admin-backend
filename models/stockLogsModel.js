var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var stockLogsSchema = new Schema({
	'productName' : String,
	'logType': String,
	'entryType' : String,
	'productType': String,
	'productId': String,
	'quantity' : Number
});

module.exports = mongoose.model('stockLogs', stockLogsSchema);
