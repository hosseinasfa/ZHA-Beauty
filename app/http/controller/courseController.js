const controller = require('./controller');
const Course = require('app/models/course');

class courseController extends controller {
    async index(req , res , next) {
        try {
            res.render('home/courses');
        } catch (err) {
            next(err);
        }
    }

    async single(req , res) {
        let course = await Course.findOne({ slug : req.params.course })
                                .populate([
                                    {
                                         path : 'user' , select : 'name'
                                    } ,
                                    'episodes'
                                ]);

        return res.json(course);

        res.render('home/single-course');
    }



}

module.exports = new courseController();