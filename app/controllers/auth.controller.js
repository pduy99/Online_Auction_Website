const passport = require('passport');
const request = require('request');
const Swal = require('sweetalert2');

module.exports.login = (req, res) => {
	// lấy các thông báo lỗi từ passport.js
	// Mặc định các thông báo lỗi trong file passport.js sẽ lưu mặc định trong flash có tên là error.
	var messages = req.flash('errors');

	// Để load page lần đầu không bị lỗi
	var dataForm = req.flash('dataForm')[0];

	// console.log('dataForm flash: ' + dataForm);

	res.render('./web/login', {
		layout: false,
		messages: messages,
		hasErrors: messages.length > 0,
		dataForm: dataForm
	});
};

module.exports.validateLogin = (req, res, next) => {
	// form values
	var username = req.body.username;
	var password = req.body.password;

	//kiểm tra các  form values
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	//check for errors
	var errors = req.validationErrors();

	dataForm = {
		username: username,
		password: password
	};

	if (errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		// console.log(messages);
		res.render('./web/register', {
			layout: false,
			messages: messages,
			hasErrors: messages.length > 0,
			dataForm: dataForm
		});
	} else {
		console.log('Qua buoc validation.');
		next();
	}
};

module.exports.postLogin = passport.authenticate('local-signin', {
	successRedirect: '/auth/route',
	failureRedirect: '/auth/login'
});

module.exports.register = (req, res) => {
	// lấy các thông báo lỗi từ passport.js
	// Mặc định các thông báo lỗi trong file passport.js sẽ lưu mặc định trong flash có tên là error.
	var messages = req.flash('errors');

	// Để load page lần đầu không bị lỗi
	var dataForm = req.flash('dataForm')[0];

	console.log('dataForm flash: ' + dataForm);

	res.render('./web/register', {
		layout: false,
		messages: messages,
		hasErrors: messages.length > 0,
		dataForm: dataForm
	});
};

module.exports.reCaptcha = (req, res, next) => {
	var recaptcha = req.body['g-recaptcha-response'];

	//Because these values have been validated so we don't need validate them here
	var username = req.body.username;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var address = req.body.address;

	//use to auto fill others field when recaptcha failed
	dataForm = {
		username: username,
		firstname: firstname,
		lastname: lastname,
		email: email,
		password: password,
		address: address
	};
	if (recaptcha === undefined || recaptcha === '' || recaptcha === null) {
		var messages = [];
		messages.push('Please select captcha');
		res.render('./web/register', {
			layout: false,
			messages: messages,
			hasErrors: 1,
			dataForm: dataForm
		});
	} else {
		const secretKey = '6LfYK8cUAAAAABUIKmmkIjWkVVXpLZ9RfGsiqLOB';
		const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}&remoteip=${req.connection.remoteAddress}`;
		request(verifyURL, (err, response, body) => {
			//if not success
			if (response.success !== undefined && !response.sucess) {
				var messages = [];
				messages.push('Recaptcha failed');
				res.render('./web/register', {
					layout: false,
					messages: messages,
					hasErrors: 1,
					dataForm: dataForm
				});
			} else {
				next();
			}
		});
	}
};

module.exports.ShowMailOTP = (req, res, next) => {
	res.render('./web/register', {
		layout: false,
		showMailOTP: true,
		email: req.body.email
	});
	next();
};

module.exports.validateRegister = (req, res, next) => {
	// form values
	var username = req.body.username;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var address = req.body.address;

	console.log('address = ' + address);

	//kiểm tra các  form values
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('firstname', 'Firstname is required').notEmpty();
	req.checkBody('lastname', 'Lastname is required').notEmpty();
	req.checkBody('email', 'Email is invalid').isEmail();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody(
		'password',
		'Password must have minimum eight characters, at least one letter and one number.'
	).matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);
	req.checkBody(
		'password',
		'Confirm password do not match. Try again!'
	).equals(req.body.confirm_password);
	//check for errors
	var errors = req.validationErrors();

	dataForm = {
		username: username,
		firstname: firstname,
		lastname: lastname,
		email: email,
		password: password,
		address: address
	};

	if (errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		// console.log(messages);
		res.render('./web/register', {
			layout: false,
			messages: messages,
			hasErrors: messages.length > 0,
			dataForm: dataForm
		});
	} else {
		console.log('Qua buoc validation.');
		next();
	}
};

module.exports.postRegister = passport.authenticate('local-register', {
	failureRedirect: '/auth/register',
	failureFlash: true
});

// FACEBOOK
module.exports.authfb = passport.authenticate('facebook');
module.exports.authfbcb = passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/auth/login'
});

module.exports.dashboard = function(req, res) {
	res.render('./web/sellerproduct');
};

//Models
var models = require('../models');

var Product = models.product;
var Category = models.category;

//  Routes
