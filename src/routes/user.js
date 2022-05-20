const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const {
	forwardAuthentication,
	ensureAuthentication,
} = require('../config/userAuth');
const controller = require('../controllers/user');

const router = express.Router();

const FILE_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg',
};

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'shop',
		allowedFormats: ['jpg', 'png', 'jpeg'],
		public_id: (req, file) => {
			const fileName = file.originalname.split(' ').join('-');
			const extension = FILE_TYPE_MAP[file.mimetype];
			return `${fileName}-${Date.now()}.${extension}`;
		},
	},
});

const uploadOptions = multer({ storage });

router.get('/shop', forwardAuthentication, controller.getShop);

router.get(
	'/login_register',
	forwardAuthentication,
	controller.getLoginRegister
);

// Login Register
router.post('/login', forwardAuthentication, controller.postLogin);
router.post('/register', forwardAuthentication, controller.postRegister);

// Dashboard
router.get('/dashboard', ensureAuthentication, controller.getDashboard);

// Cart
router.get('/cart', ensureAuthentication, controller.getCart);
router.post('/cart', ensureAuthentication, controller.postCart);
router.post('/cart/delete', ensureAuthentication, controller.postCartDelete);

// Order
router.get('/order', ensureAuthentication, controller.getOrder);

// Checkout
router.post('/checkout', ensureAuthentication, controller.postCheckout);

// Add product
router.get('/add', ensureAuthentication, controller.getAdd);
router.post(
	'/add',
	ensureAuthentication,
	uploadOptions.single('image'),
	controller.postAdd
);

// Choose to Edit or Delete current user's product
router.get('/edit_delete', ensureAuthentication, controller.getEditDelete);

// Edit current user's product
router.post(
	'/edit',
	ensureAuthentication,
	uploadOptions.single('image'),
	controller.postEdit
);
router.get('/edit/:productId', ensureAuthentication, controller.getEdit);

// Delete current user's product
router.post('/delete', ensureAuthentication, controller.postDelete);

// Profile
router.get('/profile', ensureAuthentication, controller.getProfile);
router.post('/profile', ensureAuthentication, controller.postProfile);

// Logout
router.get('/logout', ensureAuthentication, controller.postLogout);

module.exports = router;
