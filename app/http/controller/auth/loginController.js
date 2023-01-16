const controller = require('app/http/controller/controller');

class loginController extends controller {
    showLoginForm(req , res) {
        res.render('auth/login');
    }

}

module.exports = new loginController();