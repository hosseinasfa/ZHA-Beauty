const validator = require('./validator');
const { check } = require('express-validator');
const Blog = require('app/models/blog');
const path = require('path');

class blogValidator extends validator {
    handle() {
       return [


        check('title')
            .isLength({ min : 5})
            .withMessage(' عنوان نمی تواند کمتر از 5 کاراکتر باشد')
            .custom(async (value , {req}) => {
                if(req.query._method === 'put') {
                    let blog = await Blog.findById(req.params.id);
                    if(blog.title === value) return;
                }
                let blog = await Blog.findOne({ slug : this.slug(value) });
                if(blog) {
                    throw new Error('چنین مقاله ای با این عنوان قبلا در سایت قرار داده شده است')
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


        check('body')
            .isLength({ min : 20})
            .withMessage(' متن مقاله نمی تواند کمتر از 20 کاراکتر باشد'),

        check('tags')
            .not().isEmpty()
            .withMessage('فیلد تگ  نمی تواند خالی بماند'),
            ]
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }

}

module.exports = new blogValidator();
