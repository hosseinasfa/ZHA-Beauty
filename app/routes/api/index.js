const express = require('express');
const router = express.Router();

const apiv1 = require('./api-v1');
/* const apiv2 = require('./api-v2'); */

router.use('/api/v1' , apiv1);
/* router.use('/api/v2' , apiv2); */

module.exports = router;