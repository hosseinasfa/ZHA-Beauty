const controller = require('./controller');

class homeController extends controller {
    index(req , res) {
        res.render('home/index');
    }

}

module.exports = new homeController();