const mongoose = require('mongoose');

const connectDB = async function () {
  const con = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });

  console.log('MongoDB Connected:');
};

module.exports = connectDB;
