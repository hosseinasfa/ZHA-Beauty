const express = require('express');
const router = express.Router();

//Controllers
const courseController = require('app/http/controller/api/v1/courseController');
const authController = require('app/http/controller/api/v1/authController');

//Validators
const loginValidator = require('app/http/validators/loginValidator');

router.get('/courses' , courseController.courses);
router.get('/courses/:course' , courseController.singleCourse);
router.get('/courses/:course/comments' , courseController.commentForSingleCourse);

router.post('/login' , loginValidator.handle() , authController.login)

module.exports = router;