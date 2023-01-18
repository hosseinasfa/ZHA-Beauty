const controller = require('app/http/controller/controller');
const passport = require('passport');



class loginController extends controller {
    showLoginForm(req , res) {
        res.render('auth/login' , { messages : req.flash('errors')});
    }

  loginProccess(req , res , next) {
        this.validationData(req)
        .then(result =>{
            if(result) this.login(req , res , next);
            else res.redirect('/login')

        });
  };

  login(req , res , next) {
    passport.authenticate('local.login' , (err , user) => {
        if(!user) return res.redirect('/login');

        req.login(user , err =>{
            if(req.body.remember) {
                //set Token
                user.setRememberToken(res);
            }

            return res.redirect('/');
        })
    })(req , res , next);
  }

}

module.exports = new loginController();