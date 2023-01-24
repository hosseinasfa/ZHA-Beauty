const validator = require('./validator');
const { check } = require('express-validator');
const Course = require('app/models/course');
const path = require('path');

class episodeValidator extends validator {
    handle() {
       return [


        check('title')
            .isLength({ min : 5})
            .withMessage(' عنوان نمی تواند کمتر از 5 کاراکتر باشد'),



        check('type')
            .not().isEmpty()
            .withMessage('فیلد نوع دوره نمی تواند خالی بماند'),

        check('course')
            .not().isEmpty()
            .withMessage('فیلد  دوره مربوطه نمی تواند خالی بماند'),

        check('body')
            .isLength({ min : 20})
            .withMessage(' متن دوره نمی تواند کمتر از 20 کاراکتر باشد'),

        check('videoUrl')
            .not().isEmpty()
            .withMessage('  لینک دانلود نمی تواند خالی بماند'),

        check('number')
            .not().isEmpty()
            .withMessage(' شماره جلسه  نمی تواند خالی بماند'),
            ]
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }

}

module.exports = new episodeValidator();
