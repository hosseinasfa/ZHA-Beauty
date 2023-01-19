const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');


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
        return res.redirect(req.header('Referer') || '/');
      }
}



