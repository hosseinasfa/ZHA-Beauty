const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');
const isMongoId = require('validator/lib/isMongoId');
const sprintf = require('sprintf-js').sprintf;


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
      getTime(episodes) {
        let second = 0;

        episodes.forEach(episode =>{
            let time = episode.time.split(":");
            if(time.length === 2) {
                second += parseInt(time[0]) * 60;
                second += parseInt(time[1]);
            } else if(time.length === 3) {
                second += parseInt(time[0]) * 3600;
                second += parseInt(time[1]) * 60;
                second += parseInt(time[2]);
            }
        });

        let minutes = Math.floor(second / 60);

        let hours = Math.floor(minutes / 60);

        minutes -= hours * 60;

        second = Math.floor(( (second / 60 ) % 1) * 60);


        return sprintf('%02d:%02d:%02d' , hours , minutes , second);
      }
}



