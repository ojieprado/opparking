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
		const query = require('url').parse(req.url, true).query;
		const entryPoint = query.entryPoint || null;
		const slotSize = query.slotSize || null;
		const slotStatus = query.slotStatus || null;

		const slot = await getSlotsBy(entryPoint, slotSize, slotStatus, res);
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
		await newSlot.save()
			.then(data => handleResponse(res, 200, { message: 'New Slot added.', data }))
			.catch(err => handleError(res, 500, 'Error encountered while saving', err));
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
