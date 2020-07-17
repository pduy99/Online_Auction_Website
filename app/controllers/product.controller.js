const db = require('../models');
var createError = require('http-errors');
var Product = db.product;
var Category = db.category;
var bid_details = db.bid_details;

module.exports.search = async (req, res) => {
	// Lấy query từ req.
	const query = req.query.q;
	const ptId = req.query.selcat;

	console.log('Ket qua query : ' + req.query.selsort);

	let results = await db.product.searchAllByFTS(query, ptId);

	results.forEach(async p => {
		p.countBidders = await db.bid_details.countBiddersOfProduct(p.id);
	});
	// console.log(results);

	results.forEach(p => {
		//  Đánh dấu các sản phẩm mới đăng (trong vòng N phút) bằng thuộc tính isNew
		p.isNew = db.product.isNewProduct(p.start_date, 60); // 60 phút
	});

	let Cats = await db.category.categoriesAndChild();
	let PTNotParent = await db.product_type.findAllProductTypeNotParent();
	if (req.isAuthenticated()) {
		req.user.isloggedin = true;
		res.render('web/searproduct', {
			user: [req.user],
			isBidder: req.user.role === 0,
			isSeller: req.user.role === 1,
			pros: results,
			query: query,
			countPros: results.length,
			Cat: Cats,
			PTNotParent: PTNotParent
		});
	} else {
		let user = [
			{
				isloggedin: false
			}
		];
		res.render('web/searproduct', {
			user: user,
			pros: results,
			query: query,
			countPros: results.length,
			Cat: Cats,
			PTNotParent: PTNotParent
		});
	}
};
// PRODUCT DETAIL
module.exports.productdetail = async (req, res, next) => {
	try {
		var id = req.params.id;
		let ProTId = await db.product.findProductTypeIdById(id);
		// let Pro = [];
		let Bid = [];
		let ProRelate = await db.product.findRelatedProduct(ProTId, id);
		let HistoryBid = await db.bid_details.findAllHistory(id);
		let Seller = await db.product.findProSeller(id);

		if (Seller[0] !== undefined) {
			if (Seller[0].like_count === 0 && Seller[0].report_count === 0) {
				Seller[0].rating = 0;
			} else {
				Seller[0].rating =
					(Seller[0].like_count /
						(Seller[0].like_count + Seller[0].report_count)) *
					100;
			}
		}

		if (HistoryBid.length > 0) {
			// Gắn cờ cho người đang đấu giá cao nhất
			HistoryBid.forEach(h => (h.isTop = false));
			HistoryBid[0].isTop = true;
		}

		let HiggestBidder = await db.bid_details.findTheHighestBidder(id);
		console.log(HiggestBidder);
		if (HiggestBidder.length === 0) {
			HiggestBidder.push({
				firstname: 'Chưa có ai đấu giá',
				rating: 0
			});
		} else {
			if (HiggestBidder[0] !== undefined) {
				if (
					HiggestBidder[0].like_count === 0 &&
					HiggestBidder[0].report_count === 0
				) {
					HiggestBidder[0].rating = 0;
				} else {
					HiggestBidder[0].rating =
						(HiggestBidder[0].like_count /
							(HiggestBidder[0].like_count +
								HiggestBidder[0].report_count)) *
						100;
				}
			}
		}
		// HiggestBidder[0].rating =
		// 	(HiggestBidder[0].like_count /
		// 		(HiggestBidder[0].like_count + HiggestBidder[0].report_count)) *
		// 	100;

		let Pro = await db.product.findByPk(id);
		Pro.isExprired = db.product.isExprired(Pro.expriry_date);

		console.log('>>>>>>>>>>> ', Pro.isExprired);

		if (req.isAuthenticated()) {
			req.user.isloggedin = true;
			// Pro.forEach(p => {
			// 	p.isBidder = req.user.role === 0;
			// 	p.isSeller = req.user.role === 1;
			// });
			isOwner = await db.product.isSellerOfProduct(id, req.user.id);

			Cat = await db.category.categoriesAndChild();
			let PTNotParent = await db.product_type.findAllProductTypeNotParent();
			res.render('./web/productdetail', {
				user: [req.user],
				isBidder: req.user.role === 0,
				isSeller: req.user.role === 1,
				isOwner: isOwner,
				Pro: [Pro],
				ProRelate: ProRelate,
				HistoryBid: HistoryBid,
				HiggestBidder: HiggestBidder,
				Seller: Seller,
				Cat: Cat,
				PTNotParent: PTNotParent
			});
		} else {
			res.render('./web/productdetail', {
				user: [req.user],
				Pro: [Pro],
				isBidder: false,
				isSeller: false,
				isOwner: false,
				ProRelate: ProRelate,
				HistoryBid: HistoryBid,
				HiggestBidder: HiggestBidder,
				Seller: Seller,
				Cat: Cat,
				PTNotParent: PTNotParent
			});
		}
	} catch (error) {
		return next(createError(500, error));
	}
};

module.exports.product = async (req, res) => {
	let Pro4 = await db.product.findByProductTypeId(6);
	let ProTName = await db.product.findProductTypeIdNameByID(6);
	res.render('./web/product', {
		Pro4: Pro4,
		ProTName: ProTName
	});
};
