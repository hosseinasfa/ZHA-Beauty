const controller = require('app/http/controller/controller');



class registerController extends controller {
    showRegistrationForm(req , res) {
        res.render('auth/register' , { messages : req.flash('errors')});
    }

  registerProccess(req , res , next) {
    this.validationData(req)
        .then(result =>{
            if(result) res.json('register proccess')
            else res.redirect('/register')

        });
  }

  validationData(req) {
    req.checkBody('name' , 'فیلد نام نمی تواند کمتر از 5 کاراکتر باشد').isLength({ min : 5});
    req.checkBody('email' , 'فیلد ایمیل نمی تواند خالی بماند').notEmpty();
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

}

module.exports = new registerController();