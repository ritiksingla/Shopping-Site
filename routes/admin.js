const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/dashboard', adminController.getDashboard);

router.get('/add', adminController.getAdd);
router.post('/add', adminController.postAdd);

router.get('/edit_delete', adminController.getEditDelete);

router.post('/edit', adminController.postEdit);
router.get('/edit/:productId', adminController.getEdit);

router.post('/delete', adminController.postDelete);

module.exports = router;
