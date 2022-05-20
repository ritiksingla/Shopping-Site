const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
			},
			function (email, password, done) {
				User.findOne({ email }, function (mongoError, user) {
					if (mongoError) return done(mongoError);
					if (!user) {
						return done(null, false, {
							message: 'Invalid Email or Password',
						});
					}
					bcrypt
						.compare(password, user.password)
						.then(isValid => {
							if (isValid) {
								return done(null, user);
							}
							return done(null, false, {
								message: 'Invalid Email or Password',
							});
						})
						.catch(err => {
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
		User.findById(id, function (error, result) {
			done(error, result);
		});
	});
};
