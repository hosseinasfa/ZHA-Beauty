const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('app/http/controller/homeController');
const loginController = require('app/http/controller/auth/loginController');
const registerController = require('app/http/controller/auth/registerController');

// Home Routes
router.get('/' , homeController.index);
router.get('/login' , loginController.showLoginForm);
router.get('/register' , registerController.showRegistrationForm);
router.post('/register' , registerController.registerProccess);

module.exports = router;