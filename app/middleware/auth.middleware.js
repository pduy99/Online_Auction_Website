const models = require('../models');

module.exports = function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();

	res.redirect('/auth/login');
};

module.exports.isBidder = function(req, res) {
	if (req.isAuthenticated()) {
		if (req.user.role === 0) return true;
		else return false;
	} else return false;
};

module.exports.isSeller = function(req, res) {
	if (req.isAuthenticated()) {
		if (req.user.role === 1) return true;
		else return false;
	} else return false;
};

module.exports.isNotInBlackList = async (req, res, next) => {
	const userId = req.user.id;

	const proId = req.params.proid;

	if (await models.blacklist.isInBlackList(userId, proId)) {
		res.jsonp({ isInBL: true });
	} else {
		next();
	}
};

module.exports.enoughRatingPoint = (req, res, next) => {
	const userId = req.user.id;

	if (models.user.isEnableToBid(req.user)) {
		next();
	} else {
		res.jsonp({ notEnoughRP: true });
	}
};
