const express = require('express');
const router = express.Router();

// controlador
const authController = require('../controllers/authController');
const patientsController = require('../controllers/patientsController');

router.use( authController.protect ); // proteger las rutas

// pacientes
router.get('/all', patientsController.getPatients);
router.post('/create', patientsController.createPatient);
router.get('/get/:id', patientsController.getPatient);
router.patch('/update/:id', patientsController.updatePatient);
router.delete('/delete/:id', patientsController.deletePatient);

module.exports = router;