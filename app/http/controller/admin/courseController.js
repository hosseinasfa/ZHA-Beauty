const controller = require('app/http/controller/controller');
const Course = require('app/models/course');
const fs = require ('fs');

class courseController extends controller {
    index(req , res) {
        res.render('admin/courses/index' , { title : 'دوره ها'})
    };

    create (req , res) {
        res.render('admin/courses/create')
    }

    async store(req , res) {
        let status = await this.validationData(req);
        if(! status) {
            if(req.file)
                fs.unlink(req.file.path , (err) => {})
           return this.back(req,res);
        }

   
            //images
            //create course
            let images = req.body.images;
            let { title , body , type , price , tags} = req.body;

            let newCourse = new Course ({
                user : req.user._id,
                title,
                slug : this.slug(title),
                body,
                type,
                price,
                images,
                tags
            });

        await newCourse.save();

        return res.redirect('/admin/courses');
    }


    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }

}

module.exports = new courseController();