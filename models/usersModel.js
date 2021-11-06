var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var usersSchema = new Schema({
	'name' : String,
	'email' : String,
	'roleType' : String
});

usersSchema.index({ name: 'text', email: 'text', roleType: 'text' });


module.exports = mongoose.model('users', usersSchema);
