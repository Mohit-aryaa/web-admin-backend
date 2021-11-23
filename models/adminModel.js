var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
let jwt = require('jsonwebtoken');
var adminSchema = new Schema({
	'fullName' : String,
	'email' : String,
	'password' : String,
	'company' : String
});




adminSchema.methods.verifyPassword = function (password) {
    console.log('this.password', this.password);
    return this.password === password;
};

adminSchema.methods.createToken = async function() {
	try {
		let payload = { 
			email: this.email
		};

		let token = await jwt.sign(payload, 'thisissecret');
		return token;

	} catch (error) {
		return error;
	}
}

module.exports = mongoose.model('admin', adminSchema);
