const models = require('../models');

module.exports = async (req, res) => {
	Pro2 = await models.product.top5NearlyExpiriedProducts();

	Pro4 = await models.product.top5BiddedProducts();

	Pro6 = await models.product.top5PricingProducts();

	Cat = await models.category.categoriesAndChild();

	PTNotParent = await models.product_type.findAllProductTypeNotParent();

	if (req.isAuthenticated()) {
		req.user.isloggedin = true;
		res.render('web/homepage', {
			user: [req.user],
			isBidder: req.user.role === 0,
			isSeller: req.user.role === 1,
			Pro2: Pro2,
			Pro4: Pro4,
			Pro6: Pro6,
			Cat: Cat,
			PTNotParent: PTNotParent
		});
	} else {
		let user = [
			{
				isloggedin: false
			}
		];
		res.render('web/homepage', {
			user: user,
			Pro2: Pro2,
			Pro4: Pro4,
			Pro6: Pro6,
			Cat: Cat,
			PTNotParent: PTNotParent
		});
	}
};
