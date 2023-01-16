const controller = require('app/http/controller/controller');

class registerController extends controller {
    showRegistrationForm(req , res) {
        res.render('auth/register');
    }

    registerProccess(req , res , next) {
        res.json(req.body)
    }

}

module.exports = new registerController();