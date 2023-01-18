const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Controllers
const homeController = require('app/http/controller/homeController');
const loginController = require('app/http/controller/auth/loginController');
const registerController = require('app/http/controller/auth/registerController');

// Middleware
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');

// Validators
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('app/http/validators/loginValidator');


// Home Routes
router.get('/' , homeController.index);
router.get('/login' , redirectIfAuthenticated.handle , loginController.showLoginForm);
router.post('/login' , redirectIfAuthenticated.handle , loginValidator.handle() , loginController.loginProccess);

router.get('/register' , redirectIfAuthenticated.handle , registerController.showRegistrationForm);
router.post('/register' , redirectIfAuthenticated.handle , registerValidator.handle() , registerController.registerProccess);

router.get('/logout' , (req , res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie('remember_token');
        res.redirect('/');
      });
});

 

module.exports = router;