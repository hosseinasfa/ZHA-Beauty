

class adminController {
    index(req , res) {
        res.json('Admin Page')
    };
    courses(req , res) {
        res.json('Courses Page')
    };
}

module.exports = new adminController();