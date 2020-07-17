const localStrategy = require('passport-local').Strategy;
const bCrypt = require('bcryptjs');

var FacebookStrategy = require('passport-facebook').Strategy;

var configAuthFB = require('./authFB');

module.exports = function(passport, user) {
	var User = user;

	var LocalStrategy = require('passport-local').Strategy;

	//LOCAL REGISTER
	passport.use(
		'local-register',
		new LocalStrategy(
			{
				usernameField: 'email',

				passwordField: 'password',

				passReqToCallback: true // cho phép chuyển toàn bộ yêu cầu đến callback, đặc biệt hữu ích khi đăng ký.
			},
			function(req, email, password, done) {
				var generateHash = function(password) {
					return bCrypt.hashSync(
						password,
						bCrypt.genSaltSync(8),
						null
					);
				};

				User.findOne({
					where: {
						email: email
					}
				}).then(function(user) {
					var data = {
						username: req.body.username,

						password: password,

						email: email,

						address: req.body.address,

						firstname: req.body.firstname,

						lastname: req.body.lastname,

						status: 'inactive',
					};

					if (user) {
						req.flash('dataForm', data);
						console.log('email da ton tai');
						return done(
							null,
							false,
							req.flash('errors', 'That email is already taken.'),
							req.flash('dataForm', data)
						);
					} 
					else {
						var userPassword = generateHash(password);

						data.password = userPassword;

						User.create(data).then(function(newUser, created) {
							if (!newUser) {
								return done(null, false);
							}

							if (newUser) {
								return done(null, newUser);
							}
						});
						console.log('register');
						return;
					}
					
				});
			}
		)
	);

	//LOCAL SIGNIN
	passport.use(
		'local-signin',
		new LocalStrategy(
			{
				usernameField: 'username',

				passwordField: 'password',

				passReqToCallback: true
			},

			function(req, username, password, done) {
				var User = user;

				var isValidPassword = function(userpass, password) {
					return bCrypt.compareSync(password, userpass);
				};

				User.findOne({
					where: {
						username: username
					}
				})
					.then(function(user) {
						dataForm = {
							username: username,
							password: password,
						};
						if (!user) {
							return done(
								null,
								false,
								req.flash('errors', 'Username does not exist.'),
								req.flash('dataForm', dataForm)
							);
						}

						if (!isValidPassword(user.password, password)) {
							return done(
								null,
								false,
								req.flash('errors', 'Incorrect password.'),
								req.flash('dataForm', dataForm)
							);
						}
						if(user.status == 'inactive'){
							return done(
								null,
								false,
								req.flash('errors','Account is not active'),
								req.flash('dataForm',dataForm),
							);
						}
						

						var userinfo = user.get();
						return done(null, userinfo);
					})
					.catch(function(err) {
						console.log('Error:', err);

						return done(
							null,
							false,
							req.flash(
								'errors',
								'Something went wrong with your Signin.'
							),
							req.flash('dataForm', dataForm)
						);
					});
			}
		)
	);

	// =========================================================================
	// FACEBOOK ================================================================
	// =========================================================================
	passport.use(
		new FacebookStrategy(
			{
				// các thông tin để xác thực với Facebook.
				clientID: configAuthFB.facebookAuth.clientID,
				clientSecret: configAuthFB.facebookAuth.clientSecret,
				callbackURL: '/auth/fb/callback'
				// profileFields: ['id','displayName','email','first_name','last_name','middle_name']
			},
			// Facebook sẽ gửi lại chuối token và thông tin profile của user
			function(token, refreshToken, profile, done) {
				// asynchronous
				process.nextTick(function() {
					console.log('Toi day');

					// tìm trong db xem có user nào đã sử dụng facebook id này chưa
					User.findOne({
						where: {
							facebook_id: profile.id
						}
					}).then(function(user) {
						// Nếu tìm thấy user, cho họ đăng nhập
						if (user) {
							console.log('Tim thay user');
							return done(null, user); // user found, return that user
						} else {
							var newUser = {};

							// lưu các thông tin cho user
							newUser.facebook_id = profile.id;
							newUser.facebook_token = token;
							newUser.firstname = profile.name.givenName;
							newUser.lastname = profile.name.familyName;

							console.log(profile);
							// newUser.email = profile.emails[0].value; // fb có thể trả lại nhiều email, chúng ta lấy cái đầu tiền

							console.log('Tạo user mới xong');

							// lưu vào db
							User.create(newUser).then(function(
								createdUser,
								created
							) {
								if (!createdUser) {
									return done(null, false);
								}

								if (createdUser) {
									return done(null, createdUser);
								}
							});
						}
					});
				});
			}
		)
	);

	//serialize
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// deserialize user
	passport.deserializeUser(function(id, done) {
		User.findByPk(id).then(function(user) {
			if (user) {
				done(null, user.get());
			} else {
				done(user.errors, null);
			}
		});
	});
};
