const controller = require('app/http/controller/controller')

class adminController extends controller {
    index(req , res) {
        res.json('Admin Page')
    };
    courses(req , res) {
        res.json('Courses Page')
    };
}

module.exports = new adminController();