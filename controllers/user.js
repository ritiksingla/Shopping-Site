const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const cloudinary = require('../utils/cloud');

exports.getShop = async function (req, res, next) {
  let products = await Product.find();
  if (!products) {
    return res.render(index);
  }
  res.render('user/shop', {
    prods: products,
    pageTitle: 'Shop',
  });
};

exports.getLoginRegister = function (req, res, next) {
  res.render('user/login_register', {
    errorMessage: req.flash('error'),
    successMessage: req.flash('success'),
  });
};

exports.postLogin = function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failiureRedirect: '/user/login_register',
    failiureFlash: true,
  })(req, res, next);
};

exports.postRegister = async function (req, res, next) {
  const { email, password, confirm_password } = req.body;
  if (confirm_password !== password) {
    req.flash('error', 'Passwords does not match');
    return res.redirect('/user/login_register');
  }
  let user = await User.findOne({ email: email });
  if (user) {
    req.flash('error', 'User already registered with that email');
    return res.redirect('/user/login_register');
  }
  let hashedPassword = await bcrypt.hash(password, 8);
  if (!hashedPassword) {
    req.flash('error', 'Backend Error');
    return res.redirect('/user/login_register');
  }
  user = new User({
    email: email,
    password: hashedPassword,
  });
  user = await user.save();
  if (!user) {
    req.flash('error', 'Backend Error');
    return res.redirect('/user/login_register');
  } else {
    req.flash('success', 'Successfully registered');
    return res.redirect('/user/login_register');
  }
};

exports.postLogout = function (req, res, next) {
  req.logout();
  req.flash('success', 'Successfully logged out');
  return res.redirect('/user/login_register');
};

exports.getDashboard = async (req, res, next) => {
  let products = await Product.find();
  res.render('user/dashboard', {
    prods: products,
    pageTitle: 'Dashboard',
  });
};

exports.getCart = function (req, res, next) {
  if (!req.session.cart) {
    return res.render('user/cart', {
      pageTitle: 'Your Cart',
      numOfProds: 0,
    });
  }
  res.render('user/cart', {
    pageTitle: 'Your Cart',
    numOfProds: Object.keys(req.session.cart.products).length,
    cart: req.session.cart,
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
    return res.redirect('/user/cart');
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
    return res.redirect('/user/cart');
  });
};

exports.postCheckout = function (req, res, next) {
  if (
    req.user.address.country === undefined ||
    req.user.address.city === undefined ||
    req.user.address.home === undefined ||
    req.user.address.postalCode === undefined
  ) {
    req.flash('error', 'Add delivery address to checkout');
    return res.redirect('/user/cart');
  }

  if (
    req.user.address.country === '' ||
    req.user.address.city === '' ||
    req.user.address.home === '' ||
    req.user.address.postalCode === ''
  ) {
    req.flash('error', 'Add delivery address to checkout');
    return res.redirect('/user/cart');
  }

  let order = new Order({
    user: req.user._id,
    cart: req.session.cart,
  });
  order.save(function (error) {
    if (error) {
      throw error;
    }
    req.session.cart = null;
    req.flash('success', 'Order placed sucessfully');
    return res.redirect('/user/order');
  });
};

exports.getOrder = function (req, res, next) {
  const products = [];
  Order.find({ user: req.user }, function (error, order) {
    if (error) {
      throw error;
    }
    let dateToday = new Date();
    dateToday =
      dateToday.getDate() +
      '/' +
      (dateToday.getMonth() + 1) +
      '/' +
      dateToday.getFullYear();
    for (let i = 0; i < order.length; ++i) {
      for (productId in order[i].cart.products) {
        const product = order[i].cart.products[productId];
        products.push({
          item: product.product,
          qty: product.qty,
          price: product.price,
          date: dateToday,
        });
      }
    }
    res.render('user/order', {
      successMessage: req.flash('success'),
      pageTitle: 'Order History',
      prods: products,
    });
  });
};

exports.getEditDelete = async (req, res, next) => {
  let products = await Product.find({ seller: req.user._id });
  res.render('user/edit_delete', {
    prods: products,
    pageTitle: 'User Products',
  });
};

exports.getAdd = (req, res, next) => {
  return res.render('user/add', {
    pageTitle: 'Add Product',
    editing: false,
  });
};

exports.postEdit = async (req, res, next) => {
  const { productId, title, price, description } = req.body;
  let updates = {};
  let product = await Product.findById(productId);
  if (!product) {
    req.flash('error', 'No item found');
    return res.redirect('/user/edit_delete');
  }
  if (title) {
    updates.title = title;
  }
  if (price) {
    updates.price = price;
  }
  if (description) {
    updates.description = description;
  }
  if (req.file) {
    await cloudinary.uploader.destroy(product.cloudinary_id);
    updates.imageUrl = req.file.path;
    updates.cloudinary_id = req.file.filename;
  }
  product = await Product.findByIdAndUpdate(
    productId,
    { $set: updates },
    { new: true }
  );
  if (product) {
    req.flash('success', 'Product updated successfully');
  } else {
    req.flash('error', 'Backend Error');
  }
  return res.redirect('/user/edit_delete');
};

exports.postAdd = async (req, res, next) => {
  const { title, price, description } = req.body;

  // Check if product image is present
  const file = req.file;
  if (!file) {
    req.flash('error', 'No image file found');
    return res.redirect('/user/add');
  }

  let product = new Product({
    title: title,
    price: price,
    description: description,
    seller: req.user._id,
    imageUrl: file.path,
    cloudinary_id: file.filename,
  });
  product = await product.save();
  if (product) {
    req.flash('success', 'Product added successfully');
    return res.redirect('/user/dashboard');
  } else {
    req.flash('error', 'Backend Error');
    return res.redirect('/user/add');
  }
};

exports.getEdit = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/user/dashboard');
  }
  const prodId = req.params.productId;
  let product = await Product.findById(prodId).select(
    '-imageUrl -cloudinary_id -seller'
  );
  if (!product) {
    return res.redirect('/user/dashboard');
  }
  return res.render('user/add', {
    pageTitle: 'Editing Product',
    editing: true,
    product: product,
  });
};

exports.postDelete = async (req, res, next) => {
  const prodId = req.body.productId;
  let product = await Product.findByIdAndDelete(prodId);
  if (!product) {
    req.flash('error', 'Backend Error');
    return res.redirect('/user/edit_delete');
  } else {
    await cloudinary.uploader.destroy(product.cloudinary_id);
    req.flash('success', 'Product deleted successfully');
    return res.redirect('/user/edit_delete');
  }
};

exports.getProfile = async (req, res, next) => {
  res.render('user/profile', {
    user: req.user,
    pageTitle: 'Profile',
  });
};

exports.postProfile = async (req, res, next) => {
  const { email, name, country, city, address, postalcode } = req.body;
  let updates = {};
  updates.address = {};
  if (email) {
    updates.email = email;
  }
  if (name) {
    updates.name = name;
  }
  if (country) {
    updates.address.country = country;
  }
  if (city) {
    updates.address.city = city;
  }
  if (address) {
    updates.address.home = address;
  }
  if (postalcode) {
    updates.address.postalCode = postalcode;
  }
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  );
  if (user) {
    req.user = user;
    req.flash('success', 'Profile Updated Successfully');
  } else {
    req.flash('error', 'Backend Error');
  }
  return res.redirect('/user/profile');
};
