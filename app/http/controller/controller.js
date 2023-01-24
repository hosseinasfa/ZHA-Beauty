const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');
const isMongoId = require('validator/lib/isMongoId');


module.exports = class controller {
    constructor() {
        autoBind(this);
    }

    async  validationData(req) {
        const error = validationResult(req);
        if(! error.isEmpty()) {
                const errors = error.array();
                const messages = [];
    
                errors.forEach(err => messages.push(err.msg));
                
                req.flash('errors' , messages)
    
                return false;
            }
    
                return true;
      }

      back(req , res) {
        req.flash('formData' , req.body);
        return res.redirect(req.header('Referer') || '/');
      }

      //check id in a right format 
      isMongoId(paramId) {
        if(! isMongoId(paramId)) {
            this.error('آی دی وارد شده صحیح نیست' , 404)
        }
      }

      error(message , status = 500) {
        let err = new Error(message);
        err.statusCode = status;
        throw err;
      }
}



