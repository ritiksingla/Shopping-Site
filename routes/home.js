const express = require('express');
const router = express.Router();
const { forwardAuthentication } = require('../config/userAuth');

router.get('/', forwardAuthentication, function (req, res, next) {
  res.render('index', {
    pageTitle: 'Home Page',
    path: '/',
  });
});
module.exports = router;
