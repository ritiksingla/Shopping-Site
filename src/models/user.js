const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: String,
	address: {
		city: String,
		country: String,
		home: String,
		postalCode: Number,
	},
});
const User = mongoose.model('User', userSchema);
module.exports = User;
