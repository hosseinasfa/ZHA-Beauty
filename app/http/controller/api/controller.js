const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');

module.exports = class controller {
    constructor() {
        autoBind(this);
    }

    failed(msg , res , statusCode = 500) {
      res.status(statusCode).json({
        data : msg,
        status : 'error'
    })
    }

    async  validationData(req , res) {
      const error = validationResult(req);
      if(! error.isEmpty()) {
              const errors = error.array();
              const messages = [];
  
              errors.forEach(err => messages.push(err.msg));
              
              this.failed(messages , res , 403);
  
              return false;
          }
  
              return true;
    }
   
}



