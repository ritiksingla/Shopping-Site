const Product = require('../models/product');

exports.getDashboard = (req, res, next) => {
  Product.find({}, function (error, products) {
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
  Product.find({}, function (error, products) {
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
