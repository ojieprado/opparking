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
	if (plateNo !== null)
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
 * @function getSlotFeeByCarsize
 * @param {string} carSize Car Size
 */
async function getSlotFeeByCarsize(carSize) {
	switch (carSize) {
		case 'S': return 20;
		case 'M': return 60;
		case 'L': return 100;
	}
}
/**
 * @function calculateParkFees
 * @param {object} park Parking details
 * @param {number} hourDifference actualParkOut - actualParkIn
 * @param {object} res from Express
 */
async function calculateParkFees(park, hourDifference, res) {
	const id = park._id;
	const minimumFee = hourDifference <= 3 ? 40 : 5000;
	const slotFee = await getSlotFeeByCarsize(park.carSize);
	let additionalFee = 0;
	let totalFee = 0;

	if (hourDifference <= 3) {
		additionalFee = 0;
		totalFee = (additionalFee + minimumFee);
	} else if (hourDifference > 3 && hourDifference < 24) {
		additionalFee = (hourDifference - 3) * slotFee;
		totalFee = (additionalFee + minimumFee);
	} else if (hourDifference >= 24) {
		const hourToDay = Math.floor(hourDifference / 24);
		const remainderHr = hourDifference % 24;
		if (hourToDay < 1) {
			additionalFee = 0;
			totalFee = (additionalFee + minimumFee);
		} else {
			const minusDayOne = hourToDay - 1;
			additionalFee = (minusDayOne * minimumFee) + (remainderHr * slotFee);
			totalFee = (additionalFee + minimumFee);
		}
	}
	Park.findByIdAndUpdate({ _id: id }, {
		$set: {
			actualParkHour: hourDifference,
			minimumFee: minimumFee,
			additionalFee: additionalFee,
			totalFee: totalFee
		}
	})
		.then(data => data)
		.catch(err => handleError(res, 500, err));

	return Park.findById({ _id: id })
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

/**
 * @function updatePayment
 * @param {string} parkId Park id
 * @param {number} amount Amount
 * @param {object} res from Express
 */
async function updatePayment(parkId, amount, res) {
	Park.findByIdAndUpdate({ _id: parkId }, {
		$set: {
			isPaid: 'true',
			paymentAmount: amount
		}
	})
		.then(data => data)
		.catch(err => handleError(res, 500, err));

	return Park.findById({ _id: parkId })
		.then(data => data)
		.catch(err => handleError(res, 500, err));
}

module.exports = {
	getParksBy,
	getAvailableSlotBySlotId,
	getAvailableSlotByPlateNo,
	updateActualParkOut,
	updatePayment,
	checkIfParkedOut,
	getParkingDetailById,
	calculateParkFees,
	checkIfHasParkedOutHour
};
