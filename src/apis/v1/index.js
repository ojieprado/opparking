/**
 * Express: Parking System API
 * @version: v1
 */

const { Router } = require('express');
const UserService = require('../../services/user-service');
const ParkingService = require('../../services/parking-service');
const SlotService = require('../../services/slot-service');
const asyncCatch = require('../../utils/async-handler.util');
const authentication = require('../../controllers/user-controller');

const router = Router();

// Login Services
router.post('/user/login', asyncCatch(UserService.login));

// Slot Services
router.get('/slot', authentication, asyncCatch(SlotService.getSlotsBy));

router.get('/slot/:entryPoint', authentication, asyncCatch(SlotService.getSlotsBy));

router.get('/slot/:entryPoint/:slotSize', authentication, asyncCatch(SlotService.getSlotsBy));

router.post('/slot', authentication, asyncCatch(SlotService.addSlot));


// Park Services
router.get('/park', authentication, asyncCatch(ParkingService.getParks));

router.get('/park/:plateNo', authentication, asyncCatch(ParkingService.getParks));

router.post('/park', authentication, asyncCatch(ParkingService.park));

router.post('/park/:plateNo/unpark', authentication, asyncCatch(ParkingService.unpark));

router.get('/park/slot/:carSize', authentication, asyncCatch(SlotService.getAvailableSlotByCarsize));

module.exports = router;