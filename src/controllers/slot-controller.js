/**
 * Express: Slot Controller
 * author: oprado
 */
const { handleError } = require('../utils/response-handler.util');
const Slot = require('../models/slot.model');

/**
 * @function getSlotsBy
 * @param {string} entryPoint Entry Point e.g [A, B, C]
 * @param {string} slotSize Slot Size e.g [SP, LP, MP]
 * @param {object} res from Express
 */
async function getSlotsBy(entryPoint, slotSize, res) {
	if (entryPoint && !slotSize) {
		return Slot.find({
			entryPoint: entryPoint,
			slotStatus: "available"
		}).then(data => data).catch(err => handleError(res, 500, err));
	} else if (entryPoint && slotSize) {
		return Slot.find({
			entryPoint: entryPoint,
			slotSize: slotSize,
			slotStatus: "available"
		}).then(data => data).catch(err => handleError(res, 500, err));
	} else {
		return Slot.find({
			slotStatus: "available"
		}).then(data => data).catch(err => handleError(res, 500, err));
	}
}

/**
 * @function getAvailableSlotByCarsize
 * @param {string} carSize Car Size e.g [S, L, M]
 * @param {object} res from Express
 */
async function getAvailableSlotByCarsize(carSize, res) {
	let carSizes = carSize.toUpperCase();
	switch (carSizes) {
		case 'S':
			return Slot.find({
				slotStatus: "available",
				$or: [
					{ slotSize: "SP" },
					{ slotSize: "MP" },
					{ slotSize: "LP" }
				]
			}).then(data => data).catch(err => handleError(res, 500, err));
		case 'M':
			return Slot.find({
				slotStatus: "available",
				$or: [
					{ slotSize: "MP" },
					{ slotSize: "LP" }
				]
			}).then(data => data).catch(err => handleError(res, 500, err));
		case 'L':
			return Slot.find({
				slotStatus: "available",
				slotSize: "LP"
			}).then(data => data).catch(err => handleError(res, 500, err));
		default:
			handleError(res, 400, { message: 'Invalid car size.' })
	}

}

/**
 * @function checkIfSlotExist
 * @param {string} slotId
 * @param {object} res from Express
 */
async function checkIfSlotExist(slotId, res) {
	return Slot.find({ slotId: slotId })
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

/**
 * @function updateSlotAvailability
 * @param {string} slotId
 * @param {string} slotStatus
 * @param {object} res from Express
 */
async function updateSlotAvailability(slotId, slotStatus, res) {
	return Slot.findOneAndUpdate(
		{ slotId: slotId },
		{ $set: { slotStatus: slotStatus } })
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}


module.exports = { getSlotsBy, getAvailableSlotByCarsize, updateSlotAvailability, checkIfSlotExist };
