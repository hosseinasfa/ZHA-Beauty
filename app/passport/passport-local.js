const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('app/models/user');



passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


  passport.use('local.register' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true,
  } , (req , email , password , done) => {
        User.findOne({ 'email' : email } , ( err , user) =>{
            if(err) return done(err);
            if(user) return done(null , false ,  req.flash('errors' , 'چنین کاربری قبلا در سایت ثبت نام کرده است'));
            

            const newUser = new User({
                name : req.body.name,
                email,
                password
            });

            newUser.save(err => {
                if(err) return done(err , false , 'ثبت نام با موفقیت انجام نشد لطفا دوباره تلاش کنید');
                done(null , newUser);
            })
        });
  }));



  passport.use('local.login' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true,
  } , (req , email , password , done) => {
        console.log(email);
        User.findOne({ 'email' : email } , ( err , user) =>{
            if(err) return done(err);

            if(! user || ! user.comparePassword(password)) {
                return done(null , false , req.flash('errors' , 'اطلاعات وارد شده مطابقت ندارد'));
            }

            done(null , user);

            
        });
  }));