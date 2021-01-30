const express = require('express');

const controller = require('../controllers/admin');

const router = express.Router();

const {
  forwardAuthentication,
  ensureAuthentication,
} = require('../config/adminAuth');

router.get('/login', forwardAuthentication, controller.getLogin);
router.post('/login', controller.postLogin);

router.get('/register', forwardAuthentication, controller.getRegister);
router.post('/register', controller.postRegister);

router.get('/logout', ensureAuthentication, controller.postLogout);

router.get('/dashboard', ensureAuthentication, controller.getDashboard);

router.get('/add', ensureAuthentication, controller.getAdd);
router.post('/add', controller.postAdd);

router.get('/edit_delete', ensureAuthentication, controller.getEditDelete);

router.post('/edit', controller.postEdit);
router.get('/edit/:productId', ensureAuthentication, controller.getEdit);

router.post('/delete', controller.postDelete);

module.exports = router;
