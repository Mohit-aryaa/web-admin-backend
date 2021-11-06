var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var categorySchema = new Schema({
	'categoryName' : String,
	'categoryDescription' : String
});

module.exports = mongoose.model('category', categorySchema);
