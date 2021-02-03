module.exports = {
  ensureAuthentication: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please log in to move ahead');
    res.redirect('/user/login_register');
  },
  forwardAuthentication: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/user/dashboard');
  },
};
