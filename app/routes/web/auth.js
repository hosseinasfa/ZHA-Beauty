const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Controllers
const loginController = require('app/http/controller/auth/loginController');
const registerController = require('app/http/controller/auth/registerController');
const forgotPasswordController = require('app/http/controller/auth/forgotPasswordController');
const resetPasswordController = require('app/http/controller/auth/resetPasswordController');


// Validators
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('app/http/validators/loginValidator');
const forgotPasswordValidator = require('app/http/validators/forgotPasswordValidator');
const resetPasswordValidator = require('app/http/validators/resetPasswordValidator');


// Home Routes
router.get('/login'  , loginController.showLoginForm);
router.post('/login'  , loginValidator.handle() , loginController.loginProccess);

router.get('/register'  , registerController.showRegistrationForm);
router.post('/register'  , registerValidator.handle() , registerController.registerProccess);

router.get('/password/reset'  , forgotPasswordController.showForgotPasswordForm);
router.post('/password/email'  , forgotPasswordValidator.handle() , forgotPasswordController.sendPasswordResetLink);

router.get('/password/reset/:token'  , resetPasswordController.showResetPassword);
router.post('/password/reset' , resetPasswordValidator.handle()  , resetPasswordController.resetPasswordProccess);


 

module.exports = router;