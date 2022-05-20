const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	cart: {
		type: Object,
		required: true,
	},
});

module.exports = mongoose.model('Order', orderSchema);
