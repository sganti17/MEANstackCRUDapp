var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobs_Schema = new Schema({
	jobTitle : String,
	jobDescription : String,
	keywords : String,
	jobLocation: String
});

module.exports = mongoose.model('jobs',jobs_Schema);