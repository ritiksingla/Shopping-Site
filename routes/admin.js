// const express = require('express');
// const controller = require('../controllers/admin');
// const router = express.Router();
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// const {
//   forwardAuthentication,
//   ensureAuthentication,
// } = require('../config/adminAuth');

// // const FILE_TYPE_MAP = {
// //   'image/png': 'png',
// //   'image/jpeg': 'jpeg',
// //   'image/jpg': 'jpg',
// // };

// // const storage = new CloudinaryStorage({
// //   cloudinary: cloudinary,
// //   params: {
// //     folder: 'shop',
// //     allowedFormats: ['jpg', 'png', 'jpeg'],
// //     public_id: (req, file) => {
// //       const fileName = file.originalname.split(' ').join('-');
// //       const extension = FILE_TYPE_MAP[file.mimetype];
// //       return `${fileName}-${Date.now()}.${extension}`;
// //     },
// //   },
// // });

// // const uploadOptions = multer({ storage: storage });
// // router.get(
// //   '/login_register',
// //   forwardAuthentication,
// //   controller.getLoginRegister
// // );
// // router.post('/login', controller.postLogin);
// // router.post('/register', controller.postRegister);

// router.get('/logout', ensureAuthentication, controller.postLogout);

// router.get('/dashboard', ensureAuthentication, controller.getDashboard);

// router.get('/add', ensureAuthentication, controller.getAdd);
// router.post('/add', uploadOptions.single('image'), controller.postAdd);

// router.get('/edit_delete', ensureAuthentication, controller.getEditDelete);

// router.post('/edit', uploadOptions.single('image'), controller.postEdit);
// router.get('/edit/:productId', ensureAuthentication, controller.getEdit);

// router.post('/delete', controller.postDelete);

// module.exports = router;
