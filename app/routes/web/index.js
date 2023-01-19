const express = require('express');
const router = express.Router();


// Middleware
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');

// Admin Router
const adminRouter = require('./admin');
router.use('/admin' , redirectIfNotAdmin.handle , adminRouter); // add routes in admin.js to router

// Home Router
const homeRouter = require('./home');
router.use('/' , homeRouter); // add routes in home.js to router




// Auth Router
const authRouter = require('app/routes/web/auth');
router.use('/auth' , redirectIfAuthenticated.handle , authRouter); // add routes in home.js to router


module.exports = router;