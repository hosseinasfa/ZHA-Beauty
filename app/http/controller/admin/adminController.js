const controller = require('app/http/controller/controller')

class adminController extends controller {
    index(req , res , next) {
       try {
        res.render('admin/index')
       } catch (err) {
        next(err);
       }
    };

    uploadImage(req , res) {
        let image = req.file;
        res.json({
            "uploaded" : 1,
            "fileName" : image.originalname,
            "url" : `${image.destination}/${image.filename}`.substring(8)
        })
    }
}

module.exports = new adminController();