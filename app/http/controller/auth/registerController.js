const controller = require('app/http/controller/controller');
const passport = require('passport');




class registerController extends controller {
    showRegistrationForm(req , res) {
        res.render('auth/register' , { messages : req.flash('errors')});
    }

  registerProccess(req , res , next) {
    this.validationData(req)
        .then(result =>{
            if(result) this.register(req , res , next);
            else res.redirect('/register')

        });
  }


  register(req , res , next) {
    passport.authenticate('local.register' , {
        successRedirect : '/',
        failureRedirect : '/register',
        failureFlash : true
    })(req , res , next);
  }

}

module.exports = new registerController();