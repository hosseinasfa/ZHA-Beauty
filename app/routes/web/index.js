const express = require('express');
const router = express.Router();

// Admin Router
const adminRouter = require('./admin');
router.use('/admin' , adminRouter); // add routes in admin.js to router

// Home Router
const homeRouter = require('./home');
router.use('/' , homeRouter); // add routes in home.js to router

module.exports = router;