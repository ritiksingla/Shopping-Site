const express = require('express');
const {
  forwardAuthentication,
  ensureAuthentication,
} = require('../config/auth');
const controller = require('../controllers/user');
const router = express.Router();

router.get('/shop', forwardAuthentication, controller.getShop);

router.get('/login', forwardAuthentication, controller.getLogin);
router.post('/login', controller.postLogin);

router.get('/register', forwardAuthentication, controller.getRegister);
router.post('/register', controller.postRegister);

router.get('/dashboard', ensureAuthentication, controller.getDashboard);

router.get('/cart', ensureAuthentication, controller.getCart);
router.post('/cart', controller.postCart);
router.post('/cart/delete', controller.postCartDelete);

router.get('/order', controller.getOrder);

router.post('/checkout', controller.postCheckout);

router.get('/logout', ensureAuthentication, controller.postLogout);

module.exports = router;
