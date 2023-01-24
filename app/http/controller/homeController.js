const controller = require('./controller');

class homeController extends controller {
    index(req , res , next) {
        try {
            res.render('home/index');
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new homeController();