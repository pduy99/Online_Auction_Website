const User = require('../models/user');

module.exports = function(sequelize, Sequelize) {
	var Product = sequelize.define(
		'product',
		{
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},

			start_date: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW
			},

			expriry_date: {
				type: Sequelize.DATE
			},

			product_name: {
				type: Sequelize.STRING,
				notEmpty: true
			},

			initial_price: {
				// giá khởi điểm
				type: Sequelize.INTEGER,
				notEmpty: true
			},

			description: {
				type: Sequelize.TEXT
			},

			imme_buy_price: {
				// giá mua ngay
				type: Sequelize.INTEGER
			},

			step_cost: {
				// bước giá
				type: Sequelize.INTEGER,
				defaultValue: 0
			},

			auto_extend: {
				type: Sequelize.BOOLEAN, // có tự động gia hạn thêm thời gian đấu giá không ?
				default: '0'
			},
			curr_price: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},

			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				defaultValue: 'active'
			}
		},
		{
			indexes: [
				// add a FULLTEXT index
				{ type: 'FULLTEXT', name: 'text_idx', fields: ['product_name'] }
			]
		}
	);

	// Hàm tìm kiếm bằng Full-Text Search
	Product.searchAllByFTS = async function(query, ptId) {
		let sql;
		if (query != '') {
			sql = `SELECT p.*, u.lastname as lastname, u.firstname as firstname FROM products p left join users u on p.winnerId = u.id WHERE MATCH(product_name) AGAINST ('${query}' IN NATURAL LANGUAGE MODE)`;
			if (parseInt(ptId) !== 0) {
				sql += ` AND productTypeId = ${ptId}`;
			}
		} else {
			sql = `SELECT p.*, u.lastname as lastname, u.firstname as firstname FROM products p left join users u on p.winnerId = u.id WHERE p.productTypeId = ${ptId}`;
		}

		let res = await sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});

		res.forEach(async p => {
			if (p.winnerId == null) {
				p.isWinned = false;
			} else {
				p.winnerName = p.firstname + ' ' + p.lastname;
				p.isWinned = true;
			}
		});

		return res;
	};

	Product.isNewProduct = function(sd, N) {
		let startday =
			new Date(`${sd}`).getTime() +
			new Date(`${sd}`).getTimezoneOffset() * 60 * 1000;
		let currdate = new Date().getTime();

		let miliseconds_left = currdate - startday;
		if (miliseconds_left <= N * 60 * 1000) return true;
		else return false;
	};

	Product.isExprired = function(exd) {
		let exprirydate =
			new Date(`${exd}`).getTime() +
			new Date(`${exd}`).getTimezoneOffset() * 60 * 1000;
		let currdate = new Date().getTime();

		return exprirydate <= currdate;
	};

	Product.findByProductTypeId = function(id) {
		return Product.findAll({ where: { productTypeId: id } });
	};
	Product.findAllPro = function() {
		return Product.findAll();
	};
	Product.findRelatedProduct = function(id, id1) {
		let sql = `SELECT * FROM products WHERE  productTypeId = ${id} AND id!= ${id1} ORDER BY id asc
		limit 5`;
		`SELECT P.*,U.LASTNAME as lastname,U.FIRSTNAME as firstname, (select count(*) from bid_details b where b.productId = P.id) as countBidders FROM PRODUCTS P LEFT JOIN USERS U ON P.WINNERID = U.ID WHERE P.productTypeId = ${id} AND P.id!= ${id1} ORDER BY id asc
		limit 5`;

		return sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
	};
	Product.findProductTypeIdById = function(id) {
		return Product.findOne({
			where: {
				id: id
			}
		}).then(function(result) {
			if (result) {
				var ProTId = result.productTypeId;
				return ProTId;
			} else {
				console.log('Could Not Find ID');
			}
		});
	};

	Product.findProductTypeIdNameByID = function(id) {
		let sql = `SELECT * FROM product_types pt,products p WHERE  p.productTypeId = ${id} AND p.productTypeId= pt.id`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
	};

	// Tìm kiếm tất cả sản phẩm còn hạn đấu giả của 1 seller
	Product.findAllNotExpiredProducts = async id => {
		let sql = `select p.*,u.lastname as lastname, u.firstname as firstname, (select count(*) from bid_details b where b.productId = p.id) as countBids from products p left join users u on p.winnerId = u.id where p.sellerId = ${id}
		and p.expriry_date > now();`;

		let res = await sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});

		return res;
	};

	// Tìm kiếm tất cả sản phẩm đã có người thắng
	Product.findAllWinnedProducts = async id => {
		let rows = await Product.findAll({
			where: {
				sellerId: id
			}
		});

		// console.log('>>>>>>>>>> San pham :', rows);
		let res = [];
		// Chỉ trả về các sản phẩm hết hạn và có người thắng
		let exp_date,
			now = new Date();
		for (const r of rows) {
			exp_date = new Date(r.expriry_date);
			// console.log(exp_date);
			if (
				exp_date.getTime() + exp_date.getTimezoneOffset() * 60 * 1000 <=
					now.getTime() &&
				r.winnerId != null
			) {
				res.push(r);
			}
			// res.push(r);
		}
		return res;
	};

	Product.isSellerOfProduct = async function(id, sellerId) {
		let rs = await Product.findByPk(id);
		return rs.sellerId === sellerId;
	};

	Product.appendDescription = async function(id, content) {
		let sql = `update products set description = concat(description,'${content}') where id = ${id}`;
		await sequelize.query(sql, {
			type: sequelize.QueryTypes.UPDATE
		});
	};

	// Top 5 sản phẩm gần kết thúc
	Product.top5NearlyExpiriedProducts = async function() {
		let now = new Date();
		now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
		nowDate = now
			.toISOString()
			.slice(0, 19)
			.replace('T', ' ');
		console.log(now);
		let sql = `SELECT P.*,U.LASTNAME as lastname,U.FIRSTNAME as firstname, (select count(*) from bid_details b where b.productId = P.id) as countBidders FROM PRODUCTS P LEFT JOIN USERS U ON P.WINNERID = U.ID WHERE P.expriry_date > '${nowDate}' ORDER BY P.expriry_date ASC LIMIT 5`;
		let res = await sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
		res.forEach(async p => {
			console.log(p.product_name);
			if (p.winnerId == null) {
				p.isWinned = false;
			} else {
				p.winnerName = p.firstname + ' ' + p.lastname;
				p.isWinned = true;
			}
		});
		return res;
	};

	// Top 5 sản phẩm có lượt ra giá nhiều nhất
	Product.top5BiddedProducts = async function() {
		let now = new Date();
		now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
		nowDate = now
			.toISOString()
			.slice(0, 19)
			.replace('T', ' ');
		let sql = `SELECT P.*,U.LASTNAME AS lastname,U.FIRSTNAME AS firstname,  (select count(*) from bid_details b where b.productId = P.id) as countBidders FROM USERS U RIGHT JOIN PRODUCTS P ON P.WINNERID = U.ID  JOIN BID_DETAILS B ON P.ID = B.PRODUCTID where P.expriry_date > '${nowDate}' group by ID ORDER BY COUNT(P.ID) desc LIMIT 5`;
		let res = await sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
		// let res = await Product.findAll({
		// 	limit: 5,
		// 	order: [[sequelize.col('expriry_date'), 'DESC']]
		// });
		res.forEach(async p => {
			if (p.winnerId == null) {
				p.isWinned = false;
			} else {
				p.winnerName = p.firstname + ' ' + p.lastname;
				p.isWinned = true;
			}
		});
		return res;
	};

	// Top 5 sản phẩm có giá cao nhất
	Product.top5PricingProducts = async function() {
		let sql =
			'SELECT P.*,U.LASTNAME as lastname,U.FIRSTNAME as firstname, (select count(*) from bid_details b where b.productId = P.id) as countBidders FROM PRODUCTS P LEFT JOIN USERS U ON P.WINNERID = U.ID ORDER BY P.curr_price DESC LIMIT  5';
		let res = await sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
		// let res = await Product.findAll({
		// 	limit: 5,
		// 	order: [[sequelize.col('expriry_date'), 'DESC']]
		// });
		res.forEach(async p => {
			if (p.winnerId == null) {
				p.isWinned = false;
			} else {
				p.winnerName = p.firstname + ' ' + p.lastname;
				p.isWinned = true;
			}
		});
		return res;
	};
	Product.findProSeller = function(id) {
		let sql = `SELECT * FROM products p , users s WHERE p.id = ${id} AND p.sellerId = s.id`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
	};

	Product.delete = async idProduct => {
		let sql = `DELETE FROM products WHERE products.id = '${idProduct}'`;
		await sequelize.query(sql, {
			type: sequelize.QueryTypes.DELETE
		});
	};

	Product.bonusTimeProduct = async function(proId) {
		let pro = await Product.findByPk(proId);

		// Nếu sản phẩm có tự động gia hạn
		if (pro.auto_extend) {
			// Kiểm tra còn bao nhiêu phút hết hạn. Nếu <= 5 phút thì gia hạn 10 phút.
			let expdate = new Date(`${pro.expriry_date}`);
			let now = new Date();
			let offset = new Date().getTimezoneOffset();
			let diff = Math.abs(expdate - now + offset * 60 * 1000);

			let minutes = Math.floor(diff / 1000 / 60);

			console.log('>>>>>>>>> ' + minutes + ' phut');
			if (minutes <= 5) {
				// Cập nhật thời gian thêm 10 phút
				let sql = `update products set expriry_date = DATE_ADD(expriry_date, INTERVAL 10 MINUTE) where id = ${proId};`;

				await sequelize.query(sql, {
					type: sequelize.QueryTypes.UPDATE
				});

				console.log('Đã gia hạn thời gian');
				return;
			}

			console.log('Chưa tới thời điểm được gia hạn');
			return;
		}
		console.log('Không tự extend');
		return;
	};

	Product.Buynow = async function(proId, bidderId) {
		let now = new Date();
		now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
		nowDate = now
			.toISOString()
			.slice(0, 19)
			.replace('T', ' ');
		let sql = `update products set expriry_date = '${nowDate}', winnerId = ${bidderId}, curr_price = imme_buy_price where id = ${proId}`;
		let res = await sequelize.query(sql, {
			type: sequelize.QueryTypes.UPDATE
		});

		return res;
	};

	return Product;
};
