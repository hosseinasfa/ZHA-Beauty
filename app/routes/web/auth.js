const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Controllers
const loginController = require('app/http/controller/auth/loginController');
const registerController = require('app/http/controller/auth/registerController');
const forgotPasswordController = require('app/http/controller/auth/forgotPasswordController');


// Validators
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('app/http/validators/loginValidator');


// Home Routes
router.get('/login'  , loginController.showLoginForm);
router.post('/login'  , loginValidator.handle() , loginController.loginProccess);

router.get('/register'  , registerController.showRegistrationForm);
router.post('/register'  , registerValidator.handle() , registerController.registerProccess);

router.get('/password/reset'  , forgotPasswordController.showForgotPasswordForm);
router.post('/password/email'  , registerValidator.handle() , registerController.registerProccess);


 

module.exports = router;