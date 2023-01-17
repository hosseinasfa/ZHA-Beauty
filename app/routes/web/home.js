const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Controllers
const homeController = require('app/http/controller/homeController');
const loginController = require('app/http/controller/auth/loginController');
const registerController = require('app/http/controller/auth/registerController');

// Home Routes
router.get('/' , homeController.index);
router.get('/login' , loginController.showLoginForm);
router.post('/login' , loginController.loginProccess);
router.get('/register' , registerController.showRegistrationForm);
router.post('/register' , registerController.registerProccess);

 

module.exports = router;