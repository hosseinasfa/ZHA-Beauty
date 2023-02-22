const controller = require('./controller');
const Course = require('app/models/course');
const Blog = require('app/models/blog');
const Comment = require('app/models/comment');

class homeController extends controller {
    async index(req , res , next) {
        try {
            let blogs = await Blog.find({ lang : req.getLocale()}).sort({ createdAt : 1 }).limit(8).exec();
            res.render('home/index' , { blogs });
        } catch (err) {
            next(err);
        }
    }

    async about(req , res , next) {
        try {
            res.render('home/about');
        } catch (err) {
            next(err);
        }
    }

    async comment(req , res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
            
            let newComment = new Comment({
                user : req.user.id,
                ...req.body
            });

            await newComment.save();

            return this.back(req , res);

        } catch (err) {
            next(err);
        }
    }

}

module.exports = new homeController();