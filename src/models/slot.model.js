/**
 * model: Slot
 * author: oprado
 */
const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
	slotId: {
		type: String,
		required: true
	},
	slotSize: {
		type: String,
		required: true,
		enum: ['SP', 'MP', 'LP'],
		default: null
	},
	entryPoint: {
		type: String,
		required: true,
		enum: ['A', 'B', 'C'],
		default: null
	},
	slotStatus: {
		type: String,
		required: true,
		enum: ['available', 'unavailable'],
		default: 'available'
	},
});

module.exports = mongoose.model('Slot', SlotSchema);