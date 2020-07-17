const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const mailOTP = require('../controllers/mailOTP.controller');
const resetPassword = require('../controllers/reset-password.controller');

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();

	res.redirect('/auth/login');
}

router.get('/login', authController.login);
router.get('/reset-password',(req,res)=>{
	res.render('../views/web/reset-password',{
		layout:false,
	})
});

router.post('/reset-password',
			resetPassword.IdentifyEmailExist,
			resetPassword.SendMail,
			resetPassword.ChangeTemporyPassword);

router.post(
	'/login',
	authController.validateLogin,
	authController.postLogin,
	async (req, res) => {
		if (!req.user) {
			res.redirect('/auth/login');
		}
		if (req.user.role === 2) {
			res.redirect('/admin');
		} else {
			res.redirect('/');
		}
	}
);

router.post('/login', authController.validateLogin, authController.postLogin);

router.get('/route', (req, res) => {
	if (req.user.role === 2) {
		res.redirect('/admin');
	} else {
		res.redirect('/');
	}
});

router.post('/login', authController.validateLogin, authController.postLogin);

router.get('/route', (req, res) => {
	if (req.user.role === 2) {
		res.redirect('/admin');
	} else {
		res.redirect('/');
	}
});

router.get('/register', authController.register);

router.post(
	'/register',
	authController.validateRegister,
	authController.reCaptcha,
	authController.postRegister,
	authController.ShowMailOTP,
	mailOTP.MailOTP
);

router.post('/mailotp', mailOTP.Validate, mailOTP.ActivateUser);

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/auth/login');
});

// FACEBOOK ROUTES
router.get(
	'/fb',
	(req, res, next) => {
		console.log('GOi fb lần 1');
		next();
	},
	authController.authfb
);
router.get('/fb/callback', authController.authfbcb, (req, res, next) => {
	console.log('GOi lại callback');
	res.redirect('/');
});

const sellercontroller = require('../controllers/seller.controller');
router.post('/seller/add/', sellercontroller.add);
// router.get('/dashboard', sellercontroller.productname);
module.exports = router;
