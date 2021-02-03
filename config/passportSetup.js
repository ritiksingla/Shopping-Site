const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
          if (err) return done(err);
          if (!user) {
            return done(null, false, {
              message: 'Invalid Email or Password',
            });
          }
          bcrypt
            .compare(password, user.password)
            .then((isValid) => {
              if (isValid) {
                return done(null, user);
              } else {
                return done(null, false, {
                  message: 'Invalid Email or Password',
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }, function (error, result) {
      done(error, result);
    });
  });
};
