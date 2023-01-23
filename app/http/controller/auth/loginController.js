const controller = require('app/http/controller/controller');
const passport = require('passport');



class loginController extends controller {
    showLoginForm(req , res) {
        const title = 'صفحه ورود';
        res.render('home/auth/login' , { title });
    }

async  loginProccess(req , res , next) {
        let result = await this.validationData(req)
        if(result) { 
            return this.login(req , res , next);
        } 

        return this.back(req , res);
          
  };

  login(req , res , next) {
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
  }

}

module.exports = new loginController();