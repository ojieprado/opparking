/**
 * Express: Park Controller
 * author: oprado
 */
const { handleError } = require('../utils/response-handler.util');
const Park = require('../models/park.model');
const Slot = require('../models/slot.model');

/**
 * @function getAvailableSlotBySlotId
 * @param {string} plateNo Plate Number
 * @param {object} res from Express
 */
async function getParksBy(plateNo, res) {
	if (plateNo)
		return Park.find({ plateNumber: plateNo })
			.then(data => data).catch(err => handleError(res, 500, err));
	return Park.find({})
		.then(data => data).catch(err => handleError(res, 500, err));
}

/**
 * @function getAvailableSlotBySlotId
 * @param {string} slotId Parking Slot Id
 */
async function getAvailableSlotBySlotId(slotId, res) {
	return Slot.find({
		slotId: slotId,
		slotStatus: 'available'
	})
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

/**
 * @function getAvailableSlotBySlotId
 * @param {string} plateNo Plate Number
 * @param {object} res from Express
 */
async function getAvailableSlotByPlateNo(plateNo, res) {
	return Park.find({
		$or: [{
			plateNumber: plateNo,
			actualParkIn: { $ne: null },
			actualParkOut: { $eq: null },
		}]
	})
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

/**
 * @function updateActualParkOut
 * @param {string} plateNo Plate Number
 * @param {object} res from Express
 */
async function checkIfParkedOut(plateNo, res) {
	return Park.find({
		plateNumber: plateNo,
		actualParkOut: { $eq: null }
	}).then(data => data).catch(err => handleError(res, 500, err));
}

/**
 * @function checkIfHasParkedOutHour
 * @param {string} plateNo Plate Number
 * @param {object} res from Express
 */
async function checkIfHasParkedOutHour(plateNo, res) {
	return Park.find({
		plateNumber: plateNo,
		actualParkOut: { $ne: null, $lte: new Date() }
	})
		.limit(1).sort({ actualParkOut: -1 })
		.then(data => data).catch(err => handleError(res, 500, err));
}

/**
 * @function updateActualParkOut
 * @param {string} plateNo Plate Number
 * @param {object} res from Express
 */
async function updateActualParkOut(plateNo, actualParkOut, res) {
	return Park.findOneAndUpdate(
		{ plateNumber: plateNo },
		{ $set: { actualParkOut: actualParkOut } })
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

/**
 * @function updateActualParkOut
 * @param {string} id Plate Number
 * @param {object} res from Express
 */
async function getParkingDetailById(id, res) {
	return Park.findById({ _id: id })
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

/**
 * @function calculateParkFees
 * @param {object} park Parking details
 * @param {number} hourDifference actualParkOut - actualParkIn
 * @param {object} res from Express
 */
async function calculateParkFees(park, hourDifference, res) {
	const id = park._id;
	let minimumFee = (hourDifference <= 3 ? 40 : 5000);
	let additionalFee = 0;
	let totalFees = 0;

	if (hourDifference <= 3) {
		additionalFee = 0;
		totalFees = additionalFee + minimumFee;
	} else if (hourDifference > 3 && hourDifference < 24) {
		if (park.carSize === 'S') {
			additionalFee = (hourDifference - 3) * 20;
			totalFees = additionalFee + minimumFee;
		} else if (park.carSize === 'M') {
			additionalFee = (hourDifference - 3) * 60;
			totalFees = additionalFee + minimumFee;
		} else if (park.carSize === 'L') {
			additionalFee = (hourDifference - 3) * 100;
			totalFees = additionalFee + minimumFee;
		}
	} else if (hourDifference >= 24) {
		const hourToDay = Math.floor(hourDifference / 24);
		const remainderHr = hourDifference % 24;
		if (hourToDay <= 1) {
			additionalFee = 0;
			totalFees = additionalFee + minimumFee;
		} else {
			const minusDayOne = hourToDay - 1;
			if (park.carSize === 'S') {
				additionalFee = (minusDayOne * minimumFee) + (remainderHr * 20);
				totalFees = additionalFee + minimumFee;
			} else if (park.carSize === 'M') {
				additionalFee = (minusDayOne * minimumFee) + (remainderHr * 60);
				totalFees = additionalFee + minimumFee;
			} else if (park.carSize === 'L') {
				additionalFee = (minusDayOne * minimumFee) + (remainderHr * 100);
				totalFees = additionalFee + minimumFee;
			}
		}
	}
	Park.findOneAndUpdate({ _id: id }, {
		$set: {
			actualParkHour: hourDifference,
			minimumFee: minimumFee,
			additionalFee: additionalFee,
			totalFee: totalFees
		}
	})
		.then(data => data)
		.catch(err => handleError(res, 500, err));

	return Park.findById({ _id: id })
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

module.exports = {
	getParksBy,
	getAvailableSlotBySlotId,
	getAvailableSlotByPlateNo,
	updateActualParkOut,
	checkIfParkedOut,
	getParkingDetailById,
	calculateParkFees,
	checkIfHasParkedOutHour
};
