const Product = require('../models/product');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

const products = [
  new Product({
    title: 'Colorful Pencils',
    description: 'The best coloring pencils for the professional artists.',
    imageUrl:
      'https://www.publicdomainpictures.net/pictures/10000/velka/1-1232109440vZAR.jpg',
    price: 5.99,
  }),
  new Product({
    title: 'Yellow Stationary',
    description: 'Yellow stationary set to make your notes organized.',
    imageUrl:
      'https://as1.ftcdn.net/jpg/03/93/45/76/220_F_393457640_H1dqUpn8sKFIaB8fvk2lpxcSrsZJWYwd.jpg',
    price: 9.99,
  }),
  new Product({
    title: 'The Notebook',
    description:
      'Buy this notebook to note down all the important tips and codes daily.',
    imageUrl:
      'https://t3.ftcdn.net/jpg/02/00/52/34/240_F_200523424_HzY3FumKGTn10RdqjbUNBuJ6QbwFKVFS.jpg',
    price: 10.99,
  }),
  new Product({
    title: 'Parker Pen',
    description: 'Clickable pen to write your exams at the fastest speed.',
    imageUrl:
      'https://t4.ftcdn.net/jpg/00/85/18/91/240_F_85189199_ebe2H0OljNHVrModRpWckQhzz9c0qk6L.jpg',
    price: 6.99,
  }),
  new Product({
    title: 'Exam Stationary',
    description: 'Best statinary set for giving your exams.',
    imageUrl:
      'https://t4.ftcdn.net/jpg/02/07/06/19/240_F_207061956_7oLUvTYcNx5ttdVpwgTH2LoUeYVqPhuN.jpg',
    price: 19.99,
  }),
  new Product({
    title: 'Personal Computer',
    description: 'Fastest PC in the world for coding at the light speed.',
    imageUrl:
      'https://t4.ftcdn.net/jpg/03/22/58/61/240_F_322586189_9WHm7hOW7RQvIuVO7zHzBguvWdg4GOeF.jpg',
    price: 99.99,
  }),
];
Product.deleteMany({}, function (errors, results) {
  if (errors) {
    throw errors;
  }
});
for (let i = 0; i < products.length; ++i) {
  products[i].save(function (error, result) {
    if (error) {
      throw error;
    }
    if (i + 1 == products.length) {
      mongoose.disconnect();
      console.log('Disconnected');
      process.exit();
    }
  });
}
