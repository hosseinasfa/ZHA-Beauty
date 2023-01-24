const controller = require('app/http/controller/controller')

class adminController extends controller {
    index(req , res , next) {
       try {
        res.render('admin/index')
       } catch (err) {
        res.statusCode = 500;
        next(err);
       }
    };
}

module.exports = new adminController();