const validator = require('./validator');
const { check } = require('express-validator');
const Course = require('app/models/course');
const path = require('path');

class courseValidator extends validator {
    handle() {
       return [


        check('title')
            .isLength({ min : 5})
            .withMessage(' عنوان نمی تواند کمتر از 5 کاراکتر باشد')
            .custom(async value => {
                let course = await Course.findOne({ slug : this.slug(value) });
                if(course) {
                    throw new Error('چنین دوره ای با این عنوان قبلا در سایت قرار داده شده است')
                }
            }),

            check('images')
                .custom(async value => {
                    if(! value)
                    throw new Error ('وارد کردن تصویر الزامی است');

                let fileExt = ['.png' , '.jpg' , '.jpeg' , '.svg'];
                if(! fileExt.includes(path.extname(value)))
                    throw new Error('پسوند فایل وارد شده از پسوندهای تصاویر نیست');
                }),


        check('type')
            .not().isEmpty()
            .withMessage('فیلد نوع دوره نمی تواند خالی بماند'),

        check('body')
            .isLength({ min : 20})
            .withMessage(' متن دوره نمی تواند کمتر از 20 کاراکتر باشد'),

        check('price')
            .not().isEmpty()
            .withMessage(' قیمت دوره نمی تواند خالی بماند'),

        check('tags')
            .not().isEmpty()
            .withMessage('فیلد تگ  نمی تواند خالی بماند'),
            ]
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }

}

module.exports = new courseValidator();
