const models = require('../models');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth.middleware');

module.exports.postproduct = async (req, res) => {
	//  Kiểm tra phải là seller không ?
	if (auth.isSeller(req, res)) {
		let ProT = await models.product_type.findAllProT();

		Cat = await models.category.categoriesAndChild();
		let PTNotParent = await models.product_type.findAllProductTypeNotParent();
		req.user.isloggedin = true;
		res.render('web/sellerproduct', {
			user: [req.user],
			isBidder: req.user.role === 0,
			isSeller: req.user.role === 1,
			ProT: ProT,
			Cat: Cat,
			PTNotParent: PTNotParent
		});
	} else {
		res.redirect('/');
	}
};

module.exports.myproduct = async function(req, res) {
	//  Kiểm tra phải là seller không ?
	if (auth.isSeller(req, res)) {
		// let ProT = await models.product_type.findAllProT();
		let myPros = [];
		myPros = await models.product.findAllNotExpiredProducts(req.user.id);

		myPros.forEach(p => {
			if (p.winnerId !== null) {
				p.winnerName = p.lastname + ' ' + p.firstname;
			} else p.winnerName = 'Chưa có ai đấu giá';
		});

		// myPros.forEach(p => {
		// 	console.log(p.winnerName);
		// });

		if (req.session.updateSuccess == null) {
			req.session.updateSuccess = false;
		}

		Cat = await models.category.categoriesAndChild();
		let PTNotParent = await models.product_type.findAllProductTypeNotParent();
		req.user.isloggedin = true;
		res.render('web/seller/checkout', {
			user: [req.user],
			isBidder: req.user.role === 0,
			isSeller: req.user.role === 1,
			updateSuccess: req.session.updateSuccess,
			myProducts: myPros,
			PTNotParent: PTNotParent,
			Cat: Cat
		});
	} else {
		res.redirect('/');
	}
};

module.exports.mydoneproduct = async function(req, res) {
	//  Kiểm tra phải là seller không ?
	if (auth.isSeller(req, res)) {
		// let ProT = await models.product_type.findAllProT();
		let myPros = [];
		myPros = await models.product.findAllWinnedProducts(req.user.id);

		myPros.forEach(async p => {
			winner = await p.getWinner();
			p.winnerName = winner.lastname + ' ' + winner.firstname;
		});
		if (req.session.updateSuccess == null) {
			req.session.updateSuccess = false;
		}

		Cat = await models.category.categoriesAndChild();
		let PTNotParent = await models.product_type.findAllProductTypeNotParent();
		req.user.isloggedin = true;
		res.render('web/seller/mydoneproduct', {
			user: [req.user],
			isBidder: req.user.role === 0,
			isSeller: req.user.role === 1,
			updateSuccess: req.session.updateSuccess,
			myProducts: myPros,
			PTNotParent: PTNotParent,
			Cat: Cat
		});
	} else {
		res.redirect('/');
	}
};

module.exports.add = async (req, res, next) => {
	const productname = req.body.productname;
	const product_typeID = req.body.selcat;
	const product_price = req.body.product_price;
	const product_stepcost = req.body.product_stepcost;
	const product_buynowprice = req.body.product_buynowprice;
	const product_description = req.body.product_description;
	const auto_extend = req.body.auto_extend;
	console.log(req.body.expdate);

	let localCurrDate = new Date().toLocaleString('vi-VN', {
		timeZone: 'Asia/Ho_Chi_Minh'
	});
	let localExpdate = new Date(req.body.expdate).toLocaleString('vi-VN', {
		timeZone: 'Asia/Ho_Chi_Minh'
	});

	console.log(localExpdate);
	models.product
		.create({
			start_date: new Date(localCurrDate),
			expriry_date: new Date(localExpdate),
			product_name: productname,
			initial_price: product_price,
			description: product_description,
			imme_buy_price: product_buynowprice,
			curr_price: product_price,
			step_cost: product_stepcost,
			auto_extend: auto_extend,
			productTypeId: product_typeID,
			sellerId: req.user.id
		})
		.then(newlyPro => {
			let fileMainImg = req.files['main_img'];
			let filesAltImg = req.files['alt_imgs'];

			// Lưu các thông tin img vào db
			models.product_img.createFromArr(fileMainImg, true, newlyPro.id);
			models.product_img.createFromArr(filesAltImg, false, newlyPro.id);
		});
	// console.log('files img: ' + req.files);

	console.log('ĐÃ LƯU PRODUCT MOI');

	res.redirect('/seller/myproduct');
};

module.exports.edit_desc = async function(req, res, next) {
	// res.send('<h1>Thanh cong</h1>');
	let proId = req.params.id;
	let content = req.body.product_description;
	console.log(content);

	await models.product.appendDescription(proId, content);
	// res.jsonp({ success: true});
	console.log('update xong');
	res.redirect('/seller/myproduct');
	// req.session.updateSuccess = true;
	// next();
};

module.exports.deny_bid = async function(req, res, next) {
	// res.send('<h1>Thanh cong</h1>');
	let proId = req.params.proId;
	let bidderId = req.params.bidderId;
	let price = req.body.price;

	var bidder = await models.user.findByPk(bidderId);
	var Product = await models.product.findByPk(proId);

	/*
	await models.bid_details.destroy({
		where: {
			productId: proId,
			userId: bidderId,
			price: price
		}
	});

	// Nguoi mua se khong the dau gia san pham nay nua (push to black list)
	await models.blacklist.pushToBlackList(bidderId, proId);

	// Cập nhật giá hiện tại cho sản phẩm
	let HiggestBidder = await models.bid_details.findTheHighestBidder(proId);
	// console.log('+++++++++++++++++++++++ Người cao nhất: ',HiggestBidder)
	if (HiggestBidder[0].price === undefined) HiggestBidder[0].price = 0;

	// console.log('<<<<<<<<<<<<<<<<<<<<<<<< Giá cao nhất: ',HiggestBidder[0].price)
	await models.product.update(
		{
			curr_price: HiggestBidder[0].price
		},
		{
			where: {
				id: proId
			}
		}
	);
	*/

	// Gui mail cho nguoi bi kick khoi san pham

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'onlineauction.hcmus@gmail.com',
			pass: '12345678a@'
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
		}
	});

	let info = await transporter.sendMail({
		from: '"Online Auction" <onlineauction@gmail.com>',
        to: `${bidder.email}`,
        subject: "Bid Deny",
        text: `The seller of ${Product.product_name} has been denied your bid `,
        html: `Due to the denial of the seller, you are no longer able to bid <b> ${Product.product_name}</b>. Try another product !`
	  });

	console.log(info);
	
	transporter.close();
	
	console.log('Xóa thành công');
	res.jsonp({ success: true });
};

module.exports.rating = async function(req, res, next) {
	// res.send('<h1>Thanh cong</h1>');
	let bidderId = req.params.winnerId;
	let sellerId = req.user.id;
	let vote = req.body.rating;
	let content = req.body.content;

	await models.feedback.create({
		sellerId: sellerId,
		bidderId: bidderId,
		vote: vote,
		content: content
	});

	let bidderInstance = await models.user.findByPk(bidderId);

	if (vote == 1) {
		await models.user.update(
			{
				like_count: bidderInstance.like_count + 1
			},
			{
				returning: false,
				where: { id: bidderId }
			}
		);
	} else {
		await models.user.update(
			{
				report_count: bidderInstance.report_count + 1
			},
			{
				returning: false,
				where: { id: bidderId }
			}
		);
	}

	console.log('rating xong');
	res.redirect('/seller/mydoneproduct');
};

module.exports.remove_deal = async function(req, res, next) {
	// res.send('<h1>Thanh cong</h1>');
	let bidderId = req.params.winnerId;
	let proId = req.params.proId;

	console.log(bidderId + '  -  ' + proId);

	await models.product.update(
		{
			winnerId: null
		},
		{
			returning: false,
			where: { id: proId }
		}
	);

	// Feedback
	await models.feedback.create({
		sellerId: req.user.id,
		bidderId: bidderId,
		vote: 0,
		content: 'Người thắng không thanh toán.'
	});

	// Trừ điểm đánh giá đi 1 điểm
	let bidderInstance = await models.user.findByPk(bidderId);

	await models.user.update(
		{
			report_count: bidderInstance.report_count + 1
		},
		{
			returning: false,
			where: { id: bidderId }
		}
	);

	console.log('remove_deal xong');
	res.jsonp({ success: true });
};
