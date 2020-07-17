module.exports = function(sequelize, Sequelize) {
	var Blacklist = sequelize.define('blacklist', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		}
	});

	Blacklist.isInBlackList = async (userId, proId) => {
		let res = await Blacklist.count({
			where: { productId: proId, userId: userId }
		});
		console.log(res);
		if (res === 0) return false;
		else return true;
	};

	Blacklist.pushToBlackList = async (userId, proId) => {
		let count = await Blacklist.count({
			where: { productId: proId, userId: userId }
		});
		if (count === 0) {
			Blacklist.create({
				productId: proId,
				userId: userId
			});
		}
	};

	return Blacklist;
};
