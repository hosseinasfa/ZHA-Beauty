const controller = require('app/http/controller/controller');
const passport = require('passport');




class registerController extends controller {
    showRegistrationForm(req , res , next) {
        try {
            const title = 'صفحه عضویت';
            res.render('home/auth/register' , { title });
        } catch (err) {
            res.statusCode = 500;
            next(err);
        }
    }

async  registerProccess(req , res , next) {
    try {
        
        let result = await this.validationData(req)
        if(result) { 
            return this.register(req , res , next);
        } 

        return this.back(req , res);
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
          
  }


  register(req , res , next) {
    try {
        passport.authenticate('local.register' , {
            successRedirect : '/',
            failureRedirect : '/auth/register',
            failureFlash : true
        })(req , res , next);
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
  }

}

module.exports = new registerController();