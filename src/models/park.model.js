/**
 * model: Park
 * author: oprado
 */
const mongoose = require('mongoose');

const ParkSchema = new mongoose.Schema({
	slotId: {
		type: String,
		required: true
	},
	carSize: {
		type: String,
		required: true,
		enum: ['S', 'M', 'L'],
		default: null
	},
	plateNumber: {
		type: String,
		required: true
	},
	contactNumber: {
		type: String,
		required: true
	},
	actualParkIn: {
		type: Date,
		default: Date.now
	},
	actualParkOut: {
		type: Date,
		default: null
	},
	actualParkHour: {
		type: Number,
		default: null
	},
	minimumFee: {
		type: Number,
		required: true,
		default: 40
	},
	additionalFee: {
		type: Number,
		required: true,
		default: 0
	},
	totalFee: {
		type: Number,
		required: true,
		default: 0
	}
	// isPaid: {
	// 	type: Boolean,
	// 	required: true,
	// 	default: false
	// },
	// paymentAmount: {
	// 	type: Number,
	// 	required: true,
	// 	default: 0
	// }
});

module.exports = mongoose.model('Park', ParkSchema);