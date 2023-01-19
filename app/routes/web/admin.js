const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controller/admin/adminController');
const courseController = require('app/http/controller/admin/courseController');

router.use((req , res , next) => {
    res.locals.layout = "admin/master"
    next();
})

// Admin Routes
router.get('/' , adminController.index);
router.get('/courses' , courseController.index);
router.get('/courses/create' , courseController.create);



module.exports = router;