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
async function getSlotsBy(entryPoint, slotSize, slotStatus, res) {
	if (entryPoint !== null && slotSize === null && slotStatus === null) {
		console.log('entryPoint !== null && slotSize === null && slotStatus === null')
		return Slot.find({
			entryPoint: entryPoint.toUpperCase()
		}).then(data => data).catch(err => handleError(res, 500, err));

	} else if (entryPoint !== null && slotSize !== null && slotStatus === null) {
		console.log('entryPoint !== null && slotSize !== null && slotStatus === null')
		return Slot.find({
			entryPoint: entryPoint.toUpperCase(),
			slotSize: slotSize.toUpperCase()
		}).then(data => data).catch(err => handleError(res, 500, err));

	} else if (entryPoint !== null && slotStatus !== null && slotSize === null) {
		console.log('entryPoint !== null && slotStatus !== null && slotSize === null')
		return Slot.find({
			entryPoint: entryPoint.toUpperCase(),
			slotStatus: slotStatus.toLowerCase()
		}).then(data => data).catch(err => handleError(res, 500, err));

	} else if (slotSize !== null && entryPoint === null && slotStatus === null) {
		console.log('slotSize !== null && entryPoint === null && slotStatus === null')
		return Slot.find({
			slotSize: slotSize.toUpperCase(),
		}).then(data => data).catch(err => handleError(res, 500, err));

	} else if (slotSize !== null && slotStatus !== null && entryPoint === null) {
		console.log('slotSize !== null && slotStatus !== null && entryPoint === null')
		return Slot.find({
			slotSize: slotSize.toUpperCase(),
			slotStatus: slotStatus.toLowerCase()
		}).then(data => data).catch(err => handleError(res, 500, err));

	} else if (slotStatus !== null && slotSize === null && entryPoint === null) {
		console.log('slotStatus !== null && slotSize === null && entryPoint === null')
		return Slot.find({
			slotStatus: slotStatus.toLowerCase()
		}).then(data => data).catch(err => handleError(res, 500, err));

	} else if (entryPoint !== null && slotSize !== null && slotStatus !== null) {
		console.log('entryPoint !== null && slotSize !== null && slotStatus !== null')
		return Slot.find({
			entryPoint: entryPoint.toUpperCase(),
			slotSize: slotSize.toUpperCase(),
			slotStatus: slotStatus.toLowerCase()
		}).then(data => data).catch(err => handleError(res, 500, err));

	} else {
		console.log('default')
		return Slot.find({}).then(data => data).catch(err => handleError(res, 500, err));
	}
}

/**
 * @function getAvailableSlotByCarsize
 * @param {string} carSize Car Size e.g [S, L, M]
 * @param {object} res from Express
 */
async function getAvailableSlotByCarsize(carSize, res) {
	const carSizes = carSize.toUpperCase();
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
