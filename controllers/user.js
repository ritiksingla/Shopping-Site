const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {
  forwardAuthentication,
  ensureAuthentication,
} = require('../config/auth');

exports.getShop = function (req, res, next) {
  Product.find({}, function (error, products) {
    if (error) {
      throw error;
    }
    res.render('user/shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getLogin = function (req, res, next) {
  res.render('user/login', {
    pageTitle: 'Login',
    path: '/user/login',
    errorMessage: req.flash('error'),
    successMessage: req.flash('success'),
  });
};

exports.postLogin = function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failiureRedirect: '/user/login',
    failiureFlash: true,
  })(req, res, next);
};

exports.getRegister = function (req, res, next) {
  res.render('user/register', {
    pageTitle: 'Register',
    path: '/user/register',
    errorMessage: req.flash('error'),
  });
};

exports.postRegister = function (req, res, next) {
  try {
    const { email, password, confirm_password } = req.body;
    if (confirm_password !== password) {
      req.flash('error', 'Passwords does not match');
      return res.redirect('/user/register');
    }
    User.findOne({ email: email }, function (error, result) {
      if (result) {
        req.flash('error', 'Email already exists');
        return res.redirect('/user/register');
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
            return res.redirect('/user/login');
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
  res.redirect('/user/login');
};

exports.getDashboard = function (req, res, next) {
  Product.find({}, function (error, products) {
    if (error) {
      throw error;
    }
    res.render('user/dashboard', {
      path: '/user/dashboard',
      prods: products,
      pageTitle: 'User Dashboard',
    });
  });
};

exports.getCart = function (req, res, next) {
  if (!req.session.cart) {
    return res.render('user/cart', {
      path: '/user/cart',
      pageTitle: 'Your Cart',
      products: [],
    });
  }
  const cartProducts = [];
  for (const productId in req.session.cart.products) {
    cartProducts.push({
      productData: req.session.cart.products[productId].product,
      qty: req.session.cart.products[productId].qty,
    });
  }
  res.render('user/cart', {
    path: '/user/cart',
    pageTitle: 'Your Cart',
    totalQuantity: req.session.cart.totalQuantity,
    totalPrice: req.session.cart.totalPrice.toFixed(2),
    products: cartProducts,
  });
};

exports.postCart = function (req, res, next) {
  let cart = new Cart(req.session.cart);
  const prodId = req.body.productId;
  Product.findOne({ _id: prodId }, function (errors, product) {
    if (errors) {
      throw errors;
    }
    cart.add(product, prodId);
    req.session.cart = cart;
    res.redirect('/user/cart');
  });
};

exports.postCartDelete = function (req, res, next) {
  const prodId = req.body.productId;
  Product.findOne({ _id: prodId }, function (error, product) {
    if (error) {
      throw error;
    }
    let cart = new Cart(req.session.cart);
    cart.deleteOne(product, prodId);
    req.session.cart = cart;
    res.redirect('/user/cart');
  });
};

exports.postCheckout = function (req, res, next) {
  let order = new Order({
    user: {
      _id: req.user._id,
      email: req.user.email,
      password: req.user.password,
    },
    cart: req.session.cart,
    address: 'Downtown Street-4 Flat-11',
    name: 'Ritik',
  });
  order.save(function (error) {
    if (error) {
      throw error;
    }
    req.session.cart = null;
    req.flash('success', 'Order placed sucessfully');
    res.redirect('/user/order');
  });
};

exports.getOrder = function (req, res, next) {
  const products = [];
  Order.find({ user: req.user }, function (error, order) {
    if (error) {
      throw error;
    }
    for (let i = 0; i < order.length; ++i) {
      for (productId in order[i].cart.products) {
        const product = order[i].cart.products[productId];
        products.push({
          title: product.product.title,
          qty: product.qty,
        });
      }
    }
    res.render('user/order', {
      successMessage: req.flash('success'),
      pageTitle: 'Order History',
      path: '/user/order',
      prods: products,
    });
  });
};
