const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  cancelAppointment,
} = require('../controllers/appointmentController');

router.post('/', bookAppointment);
router.get('/me', getMyAppointments);
router.get('/all', getAllAppointments);
router.patch('/:id/cancel', cancelAppointment);

module.exports = router;
