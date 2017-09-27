var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_Schema = new Schema({
	username : String,
	password : String,
	email : String,
	location: String,
	phone: String,
	userType: String
});

module.exports = mongoose.model('users2',user_Schema);