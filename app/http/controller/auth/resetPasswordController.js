const controller = require('app/http/controller/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');


class resetPasswordController extends controller {
    showResetPassword(req , res , next) {
        try {
            const title = 'بازیابی رمز عبور';
            res.render('home/auth/passwords/reset' , {
                  title,
                  token : req.params.token
                 });
        } catch (err) {
            next(err);
        }
    }

    async resetPasswordProccess(req , res , next) {
        try {
            let result = await this.validationData(req)
            if(result) { 
                return this.resetPassword(req , res);
            } 
    
            req.flash('formData' , req.body);
    
            return    res.redirect('/auth/password/reset/' + req.body.token);
        } catch (err) {
            next(err);
        }
          
  };

async  resetPassword(req , res , next) {
   
    try {
        let field = await PasswordReset.findOne({ $and : [ { email : req.body.email} , { token : req.body.token } ]});
        if(! field) {
            req.flash('errors' , 'اطلاعات وارد شده صحیح نیست');
            return this.back(req , res);
        }
    
        if(field.use) {
            req.flash('errors' , 'از این لینک برای بازیابی پسوورد استفاده شده است');
            return this.back(req , res);
        }
    
        let user = await User.findOneAndUpdate({ email : field.email } , { $set : { password : req.body.password }});
        if(! user) {
            req.flash('errors' , 'تغییر پسوورد انجام نشد. لطفا دوباره تلاش نمایید');
            return this.back(req , res);
            
        }
    
        await field.update({ use : true });
        return res.redirect('/auth/login');
    } catch (err) {
        next(err);
    }

  }

}

module.exports = new resetPasswordController();