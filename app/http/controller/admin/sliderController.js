const controller = require('app/http/controller/controller');
const Slider = require('app/models/slider');
const fs = require ('fs');
const path = require ('path');
const sharp = require('sharp');

class sliderController extends controller {
    async index(req , res , next) {
        try {
            let page = req.query.page || 1;
            let sliders = await Slider.paginate({} , { page , sort : { createdAt : 1 } , limit : 10});
            res.render('admin/sliders/index' , { title : 'مقاله ها' , sliders})
        } catch (err) {
            next(err);
        }
    };

    async create (req , res) {
        res.render('admin/sliders/create')
    }

    async store(req , res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) {
                if(req.file)
                    fs.unlinkSync(req.file.path);
               return this.back(req,res);
            }
    
       

            
                //create slider
                let images = this.imageResize(req.file);
                let { title } = req.body;
    
                let newSlider = new Slider ({
                    user : req.user._id,
                    title,
                    slug : this.slug(title),
                    images,
                    thumb : images["480"],
                });
    
            await newSlider.save();
    
            return res.redirect('/admin/sliders');
        } catch(err) {
            next(err);
        }
    }

    async edit(req , res ,next) {
        try {
            this.isMongoId(req.params.id);

            let slider = await Slider.findById(req.params.id);
            if( ! slider) this.error('چنین دوره ای وجود ندارد' , 404);

            //using connect-roles in 'app/helpers/gate.js' in sliderController without dynamic permissions if you want
            req.sliderUserId = slider.user;
            if( ! req.userCan('edit-courses')) {
                this.error('شما اجازه دسترسی به این صفحه ار ندارید' , 403);
            }

    
            return res.render('admin/sliders/edit' , { slider  });
        } catch (err) {
            next(err);
        }
    }

    async update(req , res , next) {
        try {
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
                //remove previous images
                let slider = await Slider.findById(req.params.id);
                Object.values(slider.images).forEach(image => fs.unlinkSync(`./public${image}`)); 
                //set new thumbnail image
                objForUpdate.image = this.imageResize(req.file);
                objForUpdate.thumb = objForUpdate.image["480"]; 
                //set new images
                objForUpdate.images = this.imageResize(req.file); 
    
            }
            //end check if image exists
    
            delete req.body.images; //delete images from req.body because of error
            objForUpdate.slug = this.slug(req.body.title); // update new slug
    
            //update course
            await Slider.findByIdAndUpdate(req.params.id , { $set : { ...req.body , ...objForUpdate}})
    
            // redirect back
            return res.redirect('/admin/sliders');
        } catch (err) {
            next(err);
        }

    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let slider = await Slider.findById(req.params.id);
            if( ! slider) this.error('چنین دوره ای وجود ندارد' , 404);
    
 
            
            //delete images
            Object.values(slider.images).forEach(image => fs.unlinkSync(`./public${image}`));
    
            //delete courses
            slider.remove();
    
    
            return res.redirect('/admin/sliders');
        } catch (err) {
            next(err);
        }

    }

    imageResize(image) {
        const imageInfo = path.parse(image.path); //to recieve ext and name seperately
        let addressImages = {};
        addressImages['original'] = this.getUrlImage(`${image.destination}/${image.filename}`);

        const resize = size => {
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`

            addressImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);

            sharp(image.path)
                .resize(size , 360)//each parameter can be null
                .toFile(`${image.destination}/${imageName}`);
        }

            [1080 , 720 , 480].map(resize);

            return addressImages;
    }

    getUrlImage(dir) {
        return dir.substring(8);
    }




}

module.exports = new sliderController();