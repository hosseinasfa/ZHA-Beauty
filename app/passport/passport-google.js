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



