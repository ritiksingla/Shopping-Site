const path = require('path');
const env = require('dotenv');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const errorController = require('./controllers/error');
// Inititalize the application
const app = express();

// Configure Passport
require('./config/passportSetup')(passport);

// Configure the dotenv module
env.config();

// Load View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Database connection
const connectDB = async function () {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });
  console.log('MongoDB Connected:');
};
connectDB();
// Body Parser Middleware
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded
app.use(express.json()); // Parse application/json

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Express Messages Middleware
app.use(flash());

// Express Routes
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// All other routes
app.use(errorController.get404);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started @ ${PORT}`);
});
