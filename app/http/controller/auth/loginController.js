const controller = require('app/http/controller/controller');
const passport = require('passport');



class loginController extends controller {
    showLoginForm(req , res , next) {
        try {
            const title = 'صفحه ورود';
            res.render('home/auth/login' , { title });
        } catch (err) {
            next(err);
        }
    }

async  loginProccess(req , res , next) {
    try {
        let result = await this.validationData(req)
        if(result) { 
            return this.login(req , res , next);
        } 

        return this.back(req , res);
    } catch (err) {
        next(err);
    }
          
  };

  login(req , res , next) {
    try {
        passport.authenticate('local.login' , (err , user) => {
            if(!user) return res.redirect('/auth/login');
    
            req.login(user , err =>{
                if(req.body.remember) {
                    //set Token
                    user.setRememberToken(res);
                }
    
                return res.redirect('/');
            })
        })(req , res , next);
    } catch (err) {
        next(err);
    }
  }

}

module.exports = new loginController();