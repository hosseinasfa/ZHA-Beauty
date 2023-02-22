const express = require('express');
const router = express.Router();


// Controllers
const homeController = require('app/http/controller/homeController');
const courseController = require('app/http/controller/courseController');
const userController = require('app/http/controller/userController');
const blogController = require('app/http/controller/blogController');

//Validators
const commentValidator = require('app/http/validators/commentValidator');

// Middleware
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const convertFileToField = require('app/http/middleware/convertFileToField');//for ajax

//Helpers
const upload = require('app/helpers/uploadImage');//for ajax




router.get('/logout' , (req , res) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.clearCookie('remember_token');
      res.redirect('/');
    });
});



// Home Routes
router.get('/' , homeController.index);

router.get('/about-us' , homeController.about);

router.get('/courses' , courseController.index);
router.get('/courses/:course' , courseController.single);
router.post('/courses/payment' , redirectIfNotAuthenticated.handle , courseController.payment );
router.get('/courses/payment/checker' , redirectIfNotAuthenticated.handle , courseController.checker );

router.get('/blogs' , blogController.index);
router.get('/blogs/:blog' , blogController.single);

router.post('/comment' , redirectIfNotAuthenticated.handle , commentValidator.handle() , homeController.comment)
router.get('/download/:episode' , courseController.download);


router.get('/user/panel' , userController.index);
router.get('/user/panel/history' , userController.history);
router.get('/user/panel/vip' , userController.vip);
router.post('/user/panel/vip/payment' , userController.vipPayment);
router.get('/user/panel/vip/payment/check' , userController.vipPaymentCheck);

 
//for ajax
router.get('/ajaxupload' , (req , res , next) => res.render('home/ajaxupload'));
router.post('/ajaxupload' , upload.single('photo') , convertFileToField.handle , (req , res , next) => {
  try {
    res.json({...req.body , ...req.file })
  } catch (err) {
    next(err)
  }
});

module.exports = router;