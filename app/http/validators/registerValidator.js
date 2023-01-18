const validator = require('./validator');
const { check } = require('express-validator');

class registerValidator extends validator {
    handle() {
       return [ check('name')
            .isLength({ min : 5})
            .withMessage('فیلد نام نمی تواند کمتر از 5 کاراکتر باشد'),


        check('email')
            .isEmail()
            .withMessage('ایمیل معتبر نیست'),


        check('password')
            .isLength({ min : 8})
            .withMessage('فیلد پسوورد نمی تواند کمتر از 8 کاراکتر باشد')
            ]
    }

}

module.exports = new registerValidator();
