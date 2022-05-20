const path = require('path');
const env = require('dotenv');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const cors = require('cors');
const errorController = require('./controllers/error');

// Inititalize the application
const app = express();

app.use(cors());
app.options('*', cors());

env.config({ path: path.join(__dirname, 'config.env') });
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
	console.log('MongoDB Connected:');
});

mongoose.connection.on(
	'error',
	console.error.bind(console, 'Connection Error:')
);

// Configure Passport
require('./config/passportSetup')(passport);

// Load View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
			ttl: 14 * 24 * 60 * 60,
		}),
		cookie: { maxAge: 24 * 60 * 60 * 1000 },
	})
);

// Express Messages Middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// Express Routes
// const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');

// app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.use(homeRoutes);

// All other routes
app.use(errorController.get404);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started @ ${PORT}`);
});
