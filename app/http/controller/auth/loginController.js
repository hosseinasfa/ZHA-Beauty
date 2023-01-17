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
  }

  validationData(req) {
    req.checkBody('email' , 'فیلد ایمیل معتبر نیست').isEmail();
    req.checkBody('password' , 'فیلد پسوورد نمی تواند کمتر از 8 کاراکتر باشد').isLength({ min : 8});

    return req.getValidationResult()
        .then(result =>{
            const errors = result.array();
            const messages = [];
            errors.forEach(err => messages.push(err.msg));

            if(errors.length == 0)
                return true;
            
            req.flash('errors' , messages)
            return false;
        })
        .catch(err => console.log(err))
  }


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