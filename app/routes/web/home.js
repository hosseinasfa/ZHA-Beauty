const express = require('express');
const router = express.Router();


// Controllers
const homeController = require('app/http/controller/homeController');


// Home Routes
router.get('/' , homeController.index);


router.get('/logout' , (req , res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie('remember_token');
        res.redirect('/');
      });
});

 

module.exports = router;