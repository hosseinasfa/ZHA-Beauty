const controller = require('app/http/controller/controller');
const Course = require('app/models/course');
const fs = require ('fs');
const path = require ('path');
const sharp = require('sharp');

class courseController extends controller {
    async index(req , res) {
        let page = req.query.page || 1;
        let courses = await Course.paginate({} , { page , sort : { createdAt : 1 } , limit : 2});
        res.render('admin/courses/index' , { title : 'دوره ها' , courses})
    };

    create (req , res) {
        res.render('admin/courses/create')
    }

    async store(req , res) {
        let status = await this.validationData(req);
        if(! status) {
            if(req.file)
                fs.unlinkSync(req.file.path);
           return this.back(req,res);
        }

   
            //images
        
            //create course
            let images = this.imageResize(req.file);
            let { title , body , type , price , tags} = req.body;

            let newCourse = new Course ({
                user : req.user._id,
                title,
                slug : this.slug(title),
                body,
                type,
                price,
                images,
                thumb : images[480],
                tags
            });

        await newCourse.save();

        return res.redirect('/admin/courses');
    }

    async edit(req , res ,next) {
        let course = await Course.findById(req.params.id);
        if( ! course) {
            return res.json('چنین دوره ای وجود ندارد');
        }

        return res.render('admin/courses/edit' , { course });
    }

    async update(req , res , next) {
        let status = await this.validationData(req);
        if(! status) {
            if(req.file)
                fs.unlinkSync(req.file.path);
           return this.back(req,res);
        }

        let objForUpdate = {};

        //set image thumb
        objForUpdate.thumb = req.body.imagesThumb;

        //check if image exists
        if(req.file) {
            objForUpdate.image = this.imageResize(req.file);
        }
        //end check if image exists

        delete req.body.images;

        //update course
        await Course.findByIdAndUpdate(req.params.id , { $set : { ...req.body , ...objForUpdate}})

        // redirect back
        return res.redirect('/admin/courses');

    }

    async destroy(req , res) {
        let course = await Course.findById(req.params.id);
        if(! course){
            return res.json('چنین دوره ای یافت نشد');
        }

        //delete episodes
        
        //delete images
        Object.values(course.images).forEach(image => fs.unlinkSync(`./public${image}`));

        //delete courses
        course.remove();


        return res.redirect('/admin/courses');

    }

    imageResize(image) {
        const imageInfo = path.parse(image.path); //to recieve ext and name seperately
        let addressImages = {};
        addressImages['original'] = this.getUrlImage(`${image.destination}/${image.filename}`);

        const resize = size => {
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`
            addressImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);
            sharp(image.path)
                .resize(size , null)
                .toFile(`${image.destination}/${imageName}`);
        }

            [1080 , 720 , 480].map(resize);

            return addressImages;
    }

    getUrlImage(dir) {
        return dir.substring(8);
    }


    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }

}

module.exports = new courseController();