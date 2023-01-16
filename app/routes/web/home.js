const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('./../../http/controller/homeController');

// Home Routes
router.get('/' , homeController.index);

module.exports = router;