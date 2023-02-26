const validator = require('./validator');
const { check } = require('express-validator');
const Slider = require('app/models/slider');
const path = require('path');

class sliderValidator extends validator {
    handle() {
       return [


        check('title')
            .isLength({ min : 5})
            .withMessage(' عنوان نمی تواند کمتر از 5 کاراکتر باشد')
            .custom(async (value , {req}) => {
                if(req.query._method === 'put') {
                    let slider = await Slider.findById(req.params.id);
                    if(slider.title === value) return;
                }
                let slider = await Slider.findOne({ slug : this.slug(value) });
                if(slider) {
                    throw new Error('چنین دوره ای با این عنوان قبلا در سایت قرار داده شده است')
                }
            }),

            check('images')
                .custom(async (value , {req}) => {
                    if(req.query._method === 'put' && value === undefined) return;

                    if(! value)
                    throw new Error ('وارد کردن تصویر الزامی است');

                let fileExt = ['.png' , '.jpg' , '.jpeg' , '.svg'];
                if(! fileExt.includes(path.extname(value)))
                    throw new Error('پسوند فایل وارد شده از پسوندهای تصاویر نیست');
                }),

            ]
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }

}

module.exports = new sliderValidator();
