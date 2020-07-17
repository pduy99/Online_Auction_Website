module.exports = function(sequelize, Sequelize) {
	var FeedBack = sequelize.define('feedback', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},

		sellerId: {
			type: Sequelize.INTEGER,
			notEmpty: true
		},

		bidderId: {
			type: Sequelize.INTEGER,
			notEmpty: true
		},
		content: {
			type: Sequelize.TEXT
		},
		vote: {
			type: Sequelize.BOOLEAN
		}
	});

	FeedBack.findAllFeedbacks = async function(bidderId) {
		let sql = `select f.*,u.lastname as lastname, u.firstname as firstname from feedbacks f, users u where f.sellerId = u.id and bidderId = ${bidderId}`;
		let res = await sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
		return res;
	};
	return FeedBack;
};
