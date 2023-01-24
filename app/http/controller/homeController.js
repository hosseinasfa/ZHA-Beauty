const controller = require('./controller');

class homeController extends controller {
    index(req , res , next) {
        try {
            res.render('home/index');
        } catch (err) {
            res.statusCode = 500;
            next(err);
        }
    }

}

module.exports = new homeController();