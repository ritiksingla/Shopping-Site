const Product = require('../models/product');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('admin/login', {
    pageTitle: 'Admin Login',
    path: '/admin/login',
    errorMessage: req.flash('error'),
    successMessage: req.flash('success'),
  });
};

exports.postLogin = function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failiureRedirect: '/admin/login',
    failiureFlash: true,
  })(req, res, next);
};

exports.getRegister = function (req, res, next) {
  res.render('admin/register', {
    pageTitle: 'Register',
    path: '/admin/register',
    errorMessage: req.flash('error'),
  });
};

exports.postRegister = function (req, res, next) {
  try {
    const { email, password, confirm_password } = req.body;
    if (confirm_password !== password) {
      req.flash('error', 'Passwords does not match');
      return res.redirect('/admin/register');
    }
    User.findOne({ email: email }, function (error, result) {
      if (result) {
        req.flash('error', 'Email already exists');
        return res.redirect('/admin/register');
      } else {
        bcrypt
          .hash(password, 8)
          .then((hashedPassword) => {
            let user = new User();
            user.email = email;
            user.password = hashedPassword;
            user.save(function (error) {
              if (error) {
                throw error;
              }
            });
            req.flash('success', 'Successfully registered');
            return res.redirect('/admin/login');
          })
          .catch((err) => {
            throw err;
          });
      }
    });
  } catch (error) {
    throw error;
  }
};

exports.postLogout = function (req, res, next) {
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/admin/login');
};

exports.getDashboard = (req, res, next) => {
  Product.find({ email: req.user.email }, function (error, products) {
    if (error) {
      throw error;
    }
    res.render('admin/dashboard', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/dashboard',
    });
  });
};

exports.getEditDelete = (req, res, next) => {
  Product.find({ email: req.user.email }, function (error, products) {
    if (error) {
      throw error;
    }
    res.render('admin/edit_delete', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/edit_delete',
    });
  });
};

exports.getAdd = (req, res, next) => {
  res.render('admin/add', {
    pageTitle: 'Add Product',
    path: '/admin/add',
    editing: false,
  });
};

exports.postEdit = (req, res, next) => {
  const prodId = req.body.productId;
  Product.updateOne(
    { _id: prodId },
    {
      email: req.user.email,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
    },
    function (error, result) {
      if (error) {
        throw error;
      }
      res.redirect('/admin/edit_delete');
    }
  );
};

exports.postAdd = (req, res, next) => {
  let product = new Product();
  product.title = req.body.title;
  product.imageUrl = req.body.imageUrl;
  product.price = req.body.price;
  product.description = req.body.description;
  product.email = req.user.email;
  product.save(function (error) {
    if (error) {
      throw error;
    }
    res.redirect('/admin/dashboard');
  });
};

exports.getEdit = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/admin/dashboard');
  }
  const prodId = req.params.productId;
  Product.findOne({ _id: prodId }, function (error, product) {
    if (!product || error) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/add', {
      pageTitle: 'Editing Product',
      path: '/admin/add',
      editing: editMode,
      product: product,
    });
  });
};

exports.postDelete = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId }, function (errors, result) {
    if (errors) {
      throw errors;
    }
    res.redirect('/admin/edit_delete');
  });
};
