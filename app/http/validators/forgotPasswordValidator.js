const validator = require('./validator');
const { check } = require('express-validator');

class forgotPasswordValidator extends validator {
    handle() {
       return [


        check('email')
            .isEmail()
            .withMessage('ایمیل معتبر نیست'),

            ]
    }

}

module.exports = new forgotPasswordValidator();
