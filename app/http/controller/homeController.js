const controller = require('./controller');
const Course = require('app/models/course')

class homeController extends controller {
    async index(req , res , next) {
        try {
            let courses = await Course.find({}).sort({ createdAt : 1 }).limit(8).exec();
            res.render('home/index' , { courses });
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

}

module.exports = new homeController();