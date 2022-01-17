const { handleResponse, handleError } = require('../utils/response-handler.util');
const { getSlotsBy, getAvailableSlotByCarsize, checkIfSlotExist } = require('../controllers/slot-controller');
const Joi = require('joi');
const Slot = require('../models/slot.model');

/**
 * Express: Slot Controller Service
 * @class SlotService
 */
class SlotService {

	static async getSlotsBy(req, res, _next) {
		const entryPoint = req.params.entryPoint;
		const slotSize = req.params.slotSize;
		const slot = await getSlotsBy(entryPoint, slotSize, res);
		if (!slot || slot.length === 0)
			return handleError(res, 404, { message: `No Data Available` });
		return handleResponse(res, 200, { message: `Data retrieved`, data: slot });
	}

	static async addSlot(req, res, _next) {
		const slotSchema = Joi.object().keys({
			slotId: Joi.string().required(),
			slotSize: Joi.string().valid("SP", "MP", "LP").required(),
			entryPoint: Joi.string().valid("A", "B", "C").required(),
		});
		const result = slotSchema.validate(req.body);
		const slotId = result.value.slotId;
		const isSlotExist = await checkIfSlotExist(slotId, res);

		if (result.error)
			return handleError(res, 400, { message: result.error.message });
		if (isSlotExist.length !== 0)
			return handleError(res, 400, { message: `${slotId} is existing` });
		const newSlot = new Slot(result.value);
		await newSlot.save();
		return handleResponse(res, 200, { message: 'New Slot added.', data: result.value });
	}

	static async getAvailableSlotByCarsize(req, res, _next) {
		const carSize = req.params.carSize;
		const slot = await getAvailableSlotByCarsize(carSize, res);
		if (!slot || slot.length === 0)
			return handleError(res, 404, { message: `No Data Available` });
		return handleResponse(res, 200, { message: `Data retrieved`, data: slot });
	}
}

module.exports = SlotService;
