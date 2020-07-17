// Modules cai dat
const express = require('express');
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const session = require('express-session');
const Passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');

// Modules tu viet: Routers
const authRoute = require('./app/routes/auth.route');
const productRoute = require('./app/routes/product.route');
const accountRoute = require('./app/routes/account.route');

const port = 3000;
const app = express();

// Config cho PassportJS
// require('./app/configs/passport')(Passport);

var env = require('dotenv').config();

// View template engine
app.engine(
	'.hbs',
	exphbs({
		defaultLayout: 'main',
		extname: '.hbs',
		section: express_handlebars_sections(),
		helpers: {
			section: function(name, options) {
				if (!this._sections) {
					this._sections = {};
				}
				this._sections[name] = options.fn(this);
				return null;
			}
		}
	})
);
app.set('view engine', '.hbs');
app.set('views', './app/views');

// Sử dụng static resource
app.use(express.static('public'));

// Config cho req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
	session({
		cookie: { maxAge: 60000 * 30 * 24 },
		secret: 'finalproject',
		resave: true,
		saveUninitialized: true
	})
);

// Init PassportJS
app.use(Passport.initialize());
app.use(Passport.session());

// Dùng cho validate và trả về lỗi
app.use(validator());
app.use(flash());

//Models
var models = require('./app/models');

var Product = models.product;
var Category = models.category;

//  Routes
app.get('/', require('./app/controllers/homepage.controller'));
app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/bidders', require('./app/routes/bidder.route'));
app.use('/seller', require('./app/routes/seller.route'));
app.use('/account', accountRoute);
app.use('/admin', require('./app/routes/admin.route'));

//load passport strategies
require('./app/configs/passport.js')(Passport, models.user);

//Sync Database
models.sequelize
	.sync()
	.then(function() {
		console.log('Nice! Database looks fine');
	})
	.catch(function(err) {
		console.log(err, 'Something went wrong with the Database Update!');
	});

// app.use(function(req, res, next) {
// 	return res.status(404).send({ message: 'Route' + req.url + ' Not found.' });
// });
require('./app/middleware/error.middleware')(app);
app.listen(port, () => console.log(`Server listen on port ${port}!`));
