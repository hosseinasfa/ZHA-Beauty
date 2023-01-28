const express = require('express');
const router = express.Router();


// Controllers
const homeController = require('app/http/controller/homeController');
const courseController = require('app/http/controller/courseController');


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




 

module.exports = router;