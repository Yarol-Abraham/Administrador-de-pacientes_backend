const express = require('express');
const router = express.Router();

// controlador
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// autenticacion
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use( authController.protect ); // proteger las rutas

// usuarios
router.get('/me', userController.getMe);
router.patch('/updateMe', 
    userController.notAcceptPassword, 
    userController.updateMe
);
router.patch('/updatePassword', authController.updatePassword );

module.exports = router;