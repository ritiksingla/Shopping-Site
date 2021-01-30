const path = require('path');
const env = require('dotenv');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected:');
});

mongoose.connection.on(
  'error',
  console.error.bind(console, 'Connection Error:')
);

// Cookie Parser
app.use(cookieParser());
// Body Parser Middleware
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded
app.use(express.json()); // Parse application/json

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Express Messages Middleware
app.use(flash());

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Express Routes
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.use(homeRoutes);

// All other routes
app.use(errorController.get404);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started @ ${PORT}`);
});
