const validator = require('./validator');
const { check } = require('express-validator');

class forgotPasswordValidator extends validator {
    handle() {
       return [


        check('email')
            .isEmail()
            .withMessage('ایمیل معتبر نیست'),

        check('token')
            .not().isEmpty()
            .withMessage('توکن الزامی است'),

        check('password')
            .isLength({ min : 8})
            .withMessage('فیلد پسوورد نمی تواند کمتر از 8 کاراکتر باشد')

            ]
    }

}

module.exports = new forgotPasswordValidator();
