const controller = require('app/http/controller/controller');
const passport = require('passport');




class registerController extends controller {
    showRegistrationForm(req , res) {
        const title = 'صفحه عضویت';
        res.render('home/auth/register' , { messages : req.flash('errors') , title });
    }

  registerProccess(req , res , next) {
    this.validationData(req)
        .then(result =>{
            if(result) this.register(req , res , next);
            else res.redirect('/auth/register')

        });
  }


  register(req , res , next) {
    passport.authenticate('local.register' , {
        successRedirect : '/',
        failureRedirect : '/auth/register',
        failureFlash : true
    })(req , res , next);
  }

}

module.exports = new registerController();