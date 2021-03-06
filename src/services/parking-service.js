const { handleResponse, handleError } = require('../utils/response-handler.util');
const { getAvailableSlotByCarsize, updateSlotAvailability } = require('../controllers/slot-controller');
const { getParksBy, getAvailableSlotBySlotId, getAvailableSlotByPlateNo,
    updateActualParkOut, checkIfParkedOut, checkIfHasParkedOutHour, updatePayment,
    calculateParkFees, getParkingDetailById } = require('../controllers/park-controller');
const Joi = require('joi');
const Park = require('../models/park.model');
const moment = require('moment');

/**
 * Express: Parking Controller Service
 * @class ParkingService
 */
class ParkingService {

    static async getParks(req, res, _next) {
        const query = require('url').parse(req.url, true).query;
        const plateNumber = query.plateNumber || null;
        const parks = await getParksBy(plateNumber, res);
        if (!parks || parks.length === 0)
            return handleError(res, 400, { message: `No Data Available` });
        return handleResponse(res, 200, { message: `Data retrieved`, data: parks });
    }

    static async park(req, res, _next) {
        const parkSchema = Joi.object().keys({
            carSize: Joi.string().valid("S", "M", "L").required(),
            plateNumber: Joi.string().uppercase().length(8).required(),
            slotId: Joi.string().length(6).required(),
            contactNumber: Joi.string().length(10).pattern(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)
        });
        const actualParkIn = new Date().toISOString();
        const result = parkSchema.validate(req.body);
        const carSize = result.value.carSize;
        const slotId = result.value.slotId;
        const plateNumber = result.value.plateNumber;

        const slot = await getAvailableSlotByCarsize(carSize, res);
        const available = await getAvailableSlotBySlotId(slotId, res);
        const alreadyParked = await getAvailableSlotByPlateNo(plateNumber, res);
        const checkAwayHour = await checkIfHasParkedOutHour(plateNumber, res);

        if (result.error)
            return handleError(res, 400, { message: result.error.message });
        if (slot.length === 0) {
            return handleError(res, 400, { message: `Parking Slot is unavailable or smaller than your car size` });
        } else if (available.length === 0) {
            return handleError(res, 400, { message: `Parking Slot is unavailable` });
        } else if (alreadyParked.length >= 1) {
            return handleError(res, 400, { message: `You already parked` });
        } else if (checkAwayHour.length !== 0) {
            const awayDifference = moment(checkAwayHour.actualParkOut);
            const hourDifference = moment(actualParkIn).diff(awayDifference, 'hours');
            if (hourDifference <= 1) {
                await updateActualParkOut(plateNumber.toUpperCase(), null, res);
                await updateSlotAvailability(slotId, 'unavailable', res);
                return handleResponse(res, 202, { message: 'Park out has been reset.' });
            }
        } else {
            const newPark = new Park({ actualParkIn: actualParkIn, ...result.value });
            await updateSlotAvailability(slotId, 'unavailable', res);
            await newPark.save()
                .then(data => handleResponse(res, 202, { message: 'You parked successfully.', data: data }))
                .catch(err => handleError(res, 400, { message: 'Error encountered while saving', data: err }));
        }
    }

    static async unpark(req, res, _next) {
        const plateNo = req.params.plateNo;
        const alreadyParkedOut = await checkIfParkedOut(plateNo.toUpperCase(), res);
        if (alreadyParkedOut.length === 0)
            return handleError(res, 404, { message: `Plate Number doesn't exist or already parked out` });
        const actualParkOut = new Date().toISOString();
        const updateParkedOut = await updateActualParkOut(plateNo.toUpperCase(), actualParkOut, res);
        if (updateParkedOut) {
            const parkingDetail = await getParkingDetailById(updateParkedOut._id, res);
            const actualParkIn = moment(parkingDetail.actualParkIn);
            const actualParkOut = moment(parkingDetail.actualParkOut);
            const hourDifference = actualParkOut.diff(actualParkIn, 'hours');
            const receipt = await calculateParkFees(parkingDetail, hourDifference, res);
            const updateSlot = await updateSlotAvailability(parkingDetail.slotId, 'available', res);
            if (updateSlot) return handleResponse(res, 202, { message: 'You parked out', data: receipt });
        }
    }

    // static async payment(req, res, _next) {
    //     const paymentSchema = Joi.object().keys({
    //         parkId: Joi.string().required(),
    //         amount: Joi.number().required()
    //     });
    //     const result = paymentSchema.validate(req.body);
    //     const parkId = result.value.parkId;
    //     const amount = result.value.amount;
    //     if (result.error) return handleError(res, 400, { message: result.error.message });
    //     const paid = await updatePayment(parkId, amount, res);
    //     if (!paid) return handleResponse(res, 404, { message: 'You have not paid your parking.' });
    //     return handleResponse(res, 200, { message: 'You have paid your parking.', data: paid });
    // }
}

module.exports = ParkingService;
