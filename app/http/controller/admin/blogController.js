const controller = require('app/http/controller/controller');
const Blog = require('app/models/blog');
const Category = require('app/models/category');
const fs = require ('fs');
const path = require ('path');
const sharp = require('sharp');

class blogController extends controller {
    async index(req , res , next) {
        try {
            let page = req.query.page || 1;
            let blogs = await Blog.paginate({} , { page , sort : { createdAt : 1 } , limit : 10});
            res.render('admin/blogs/index' , { title : 'دوره ها' , blogs})
        } catch (err) {
            next(err);
        }
    };

    async create (req , res) {
        let categories = await Category.find({});
        res.render('admin/blogs/create' , { categories })
    }

    async store(req , res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) {
                if(req.file)
                    fs.unlinkSync(req.file.path);
               return this.back(req,res);
            }
    
       

            
                //create blog
                let images = this.imageResize(req.file);
                let { title , body , tags , lang} = req.body;
    
                let newBlog = new Blog ({
                    user : req.user._id,
                    title,
                    slug : this.slug(title),
                    body,
                    images,
                    thumb : images["480"],
                    tags,
                    lang
                });
    
            await newBlog.save();
    
            return res.redirect('/admin/blogs');
        } catch(err) {
            next(err);
        }
    }

    async edit(req , res ,next) {
        try {
            this.isMongoId(req.params.id);

            let blog = await Blog.findById(req.params.id);
            if( ! blog) this.error('چنین دوره ای وجود ندارد' , 404);



            let categories = await Category.find({});
    
            return res.render('admin/blogs/edit' , { blog , categories });
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
                let blog = await Blog.findById(req.params.id);
                Object.values(blog.images).forEach(image => fs.unlinkSync(`./public${image}`)); 
                //set new thumbnail image
                objForUpdate.image = this.imageResize(req.file);
                objForUpdate.thumb = objForUpdate.image["480"]; 
                //set new images
                objForUpdate.images = this.imageResize(req.file); 
    
            }
            //end check if image exists
    
            delete req.body.images; //delete images from req.body because of error
            objForUpdate.slug = this.slug(req.body.title); // update new slug
    
            //update blog
            await Blog.findByIdAndUpdate(req.params.id , { $set : { ...req.body , ...objForUpdate}})
    
            // redirect back
            return res.redirect('/admin/blogs');
        } catch (err) {
            next(err);
        }

    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let blog = await Blog.findById(req.params.id).populate('comments').exec();;
            if( ! blog) this.error('چنین دوره ای وجود ندارد' , 404);
    
            //delete comments
            blog.comments.forEach(comment => comment.remove());

            // course.episodes.forEach(episode => episode.remove());
            
            //delete images
            Object.values(blog.images).forEach(image => fs.unlinkSync(`./public${image}`));

            

    
            //delete blogs
            blog.remove();
    
    
            return res.redirect('/admin/blogs');
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

module.exports = new blogController();