const model = require('../models');
const bCrypt = require('bcryptjs');
const passport = require('passport');

var User = model.user;
module.exports.account = (req, res) => {
	if (req.isAuthenticated()) {
		model.user
			.findOne({
				where: {
					id: req.session.passport.user
				}
			})
			.then(async dbUser => {
				let user = [
					{
						userInfo: dbUser.dataValues,
						id: req.session.passport.user,
						isloggedin: true
					}
				];
				Cat = await model.category.categoriesAndChild();

				PTNotParent = await model.product_type.findAllProductTypeNotParent();
				req.user.isloggedin = true;
				res.render('web/account', {
					userI: user,
					user: [req.user],
					isBidder: req.user.role === 0,
					isSeller: req.user.role === 1,
					Cat: Cat,
					PTNotParent: PTNotParent
				});
			});
	} else {
		res.redirect('auth/login');
	}
};

module.exports.ValidateEdit = (req, res, next) => {
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('firstname', 'Firstname is required').notEmpty();
	req.checkBody('lastname', 'Lastname is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	//check for errors
	var errors = req.validationErrors();

	if (errors) {
		model.user
			.findOne({
				where: {
					id: req.session.passport.user
				}
			})
			.then(async dbUser => {
				var messages = [];
				errors.forEach(function(error) {
					messages.push(error.msg);
				});
				let user = [
					{
						userInfo: dbUser.dataValues,
						id: req.session.passport.user,
						isloggedin: true
					}
				];
				Cat = await model.category.categoriesAndChild();

				PTNotParent = await model.product_type.findAllProductTypeNotParent();
				res.render('web/account', {
					messages: messages,
					hasErrors: messages.length > 0,
					user: user,
					Cat: Cat,
					PTNotParent: PTNotParent
				});
			});
	} else {
		console.log('Qua buoc validation.');
		next();
	}
};

module.exports.edit = (req, res) => {
	var username = req.body.username;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;

	var user = {
		username: username,
		firstname: firstname,
		lastname: lastname,
		id: req.session.passport.user
	};

	User.EditProfile(user).then(function(result) {
		if (result[0] == 1) {
			model.user
				.findOne({
					where: {
						id: req.session.passport.user
					}
				})
				.then(async dbUser => {
					let user = [
						{
							userInfo: dbUser.dataValues,
							id: req.session.passport.user,
							isloggedin: true
						}
					];
					Cat = await model.category.categoriesAndChild();

					PTNotParent = await model.product_type.findAllProductTypeNotParent();
					res.render('web/account', {
						editProfileSuccess: true,
						user: user,
						Cat: Cat,
						PTNotParent: PTNotParent
					});
				});
		} else {
			model.user
				.findOne({
					where: {
						id: req.session.passport.user
					}
				})
				.then(async dbUser => {
					let user = [
						{
							userInfo: dbUser.dataValues,
							id: req.session.passport.user,
							isloggedin: true
						}
					];
					Cat = await model.category.categoriesAndChild();

					PTNotParent = await model.product_type.findAllProductTypeNotParent();
					res.render('web/account', {
						editProfileFailed: true,
						user: user,
						Cat: Cat,
						PTNotParent: PTNotParent
					});
				});
		}
	});
};

module.exports.ShowPageChangePassword = (req, res) => {
	var messages = req.flash('errors');

	model.user
		.findOne({
			where: {
				id: req.session.passport.user
			}
		})
		.then(async dbUser => {
			let user = [
				{
					userInfo: dbUser.dataValues,
					id: req.session.passport.user,
					isloggedin: true
				}
			];
			Cat = await model.category.categoriesAndChild();

			PTNotParent = await model.product_type.findAllProductTypeNotParent();
			req.user.isloggedin = true;

			res.render('web/change-password', {
				user: [req.user],
				messages: messages,
				hasErrors: messages.length > 0,
				user: user,
				Cat: Cat,
				PTNotParent: PTNotParent
			});
		});
};

module.exports.ValidateCurrentPassword = passport.authenticate('local-signin', {
	failureFlash: true,
	failureRedirect: '/account/change-password'
});

module.exports.PostChangePassword = (req, res) => {
	req.checkBody(
		'newPass',
		'Confirm password do not match. Try again!'
	).equals(req.body.confirm_password);

	var errors = req.validationErrors();

	if (errors) {
		//confirm password not match
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		model.user
			.findOne({
				where: {
					id: req.session.passport.user
				}
			})
			.then(async dbUser => {
				let user = [
					{
						userInfo: dbUser.dataValues,
						id: req.session.passport.user,
						isloggedin: true
					}
				];
				Cat = await model.category.categoriesAndChild();

				PTNotParent = await model.product_type.findAllProductTypeNotParent();
				res.render('web/change-password', {
					messages: messages,
					hasErrors: true,
					user: user,
					Cat: Cat,
					PTNotParent: PTNotParent
				});
			});
	} else {
		var newPass = req.body.newPass;
		var hashPass = bCrypt.hashSync(newPass, bCrypt.genSaltSync(8), null);
		var user = {
			id: req.session.passport.user,
			password: hashPass
		};
		model.user.ChangePassword(user).then(function(result) {
			if (result[0] == 1) {
				model.user
					.findOne({
						where: {
							id: req.session.passport.user
						}
					})
					.then(dbUser => {
						let user = [
							{
								userInfo: dbUser.dataValues,
								id: req.session.passport.user,
								isloggedin: true
							}
						];
						res.render('web/change-password', {
							changePasswordSuccess: true,
							user: user
						});
					});
			} else {
				model.user
					.findOne({
						where: {
							id: req.session.passport.user
						}
					})
					.then(dbUser => {
						let user = [
							{
								userInfo: dbUser.dataValues,
								id: req.session.passport.user,
								isloggedin: true
							}
						];
						res.render('web/account', {
							changePasswordSuccess: true,
							user: user
						});
					});
			}
		});
	}
};

module.exports.ShowPageChangeEmail = (req, res) => {
	model.user
		.findOne({
			where: {
				id: req.session.passport.user
			}
		})
		.then(dbUser => {
			let user = [
				{
					userInfo: dbUser.dataValues,
					id: req.session.passport.user,
					isloggedin: true
				}
			];
			res.render('web/change-email', {
				user: user
			});
		});
};

module.exports.changeEmail = (req, res, next) => {
	var user = {
		email: req.body.email,
		id: req.session.passport.user
	};

	model.user.ChangeEmail(user).then(function(result) {
		if (result[0] == 1) {
			next();
		} else {
			res.render('web/change-email');
		}
	});
};

module.exports.ShowMailOTP = (req, res, next) => {
	res.render('web/change-email', {
		showMailOTP: true,
		email: req.body.email
	});
	next();
};

module.exports.ActivateEmail = (req, res, next) => {
	var email = req.body.email;
	model.user.Activate(email).then(function(result) {
		if (result[0] == 1) {
			model.user
				.findOne({
					where: {
						id: req.session.passport.user
					}
				})
				.then(dbUser => {
					let user = [
						{
							userInfo: dbUser.dataValues,
							id: req.session.passport.user,
							isloggedin: true
						}
					];
					res.render('web/change-email', {
						user: user,
						changeEmailSuccess: true
					});
				});
		} else {
			model.user
				.findOne({
					where: {
						id: req.session.passport.user
					}
				})
				.then(dbUser => {
					let user = [
						{
							userInfo: dbUser.dataValues,
							id: req.session.passport.user,
							isloggedin: true
						}
					];
					res.render('web/change-email', {
						user: user,
						changeEmailFailed: true
					});
				});
		}
	});
};

module.exports.upgradeaccount = async (req, res, next) => {
	let id = req.session.passport.user;
	model.user.update(
		{
			upgrade: 1
		},
		{
			//returning: false,
			where: {
				id: id
			}
		}
	);
};
