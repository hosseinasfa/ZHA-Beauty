const validator = require('./validator');
const { check } = require('express-validator');
const Role = require('app/models/role');

class roleValidator extends validator {
    handle() {
       return [


        check('name')
            .isLength({ min : 3})
            .withMessage(' عنوان نمی تواند کمتر از 3 کاراکتر باشد')
            .custom(async (value , {req}) => {
                if(req.query._method === 'put') {
                    let role = await Role.findById(req.params.id);
                    if(role.name === value) return;
                }
                let role = await Role.findOne({ name : value });
                if(role) {
                    throw new Error('چنین سطح دسترسی با این عنوان قبلا در سایت قرار داده شده است')
                }
            }),


        check('label')
            .not().isEmpty()
            .withMessage('فیلد توضیح نمی تواند خالی بماند'),

        check('permissions')
            .not().isEmpty()
            .withMessage('فیلد لیست اجازه دسترسی نمی تواند خالی بماند'),

            ]
    }



}

module.exports = new roleValidator();
