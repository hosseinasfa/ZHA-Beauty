const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controller/admin/adminController');

// Admin Routes
router.get('/' , adminController.index);
router.get('/courses' , adminController.courses);



module.exports = router;