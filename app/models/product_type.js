module.exports = function(sequelize, Sequelize) {
	var ProductType = sequelize.define('product_type', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},

		protype_name: {
			type: Sequelize.STRING
		}
	});
	ProductType.findAllProT = function() {
		return ProductType.findAll();
	};

	ProductType.add = async (pt_name, cat_id) => {
		let sql;
		if (cat_id == '')
			sql = `INSERT INTO product_types(protype_name, createdAt, updatedAt, categoryId) VALUES ('${pt_name}', now(), now(), null)`;
		else
			sql = `INSERT INTO product_types(protype_name, createdAt, updatedAt, categoryId) VALUES ('${pt_name}', now(), now(), '${cat_id}')`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.INSERT
		});
	};

	ProductType.update = async (pt_id, pt_name, cat_id) => {
		let sql;
		if (cat_id == '')
			sql = `UPDATE product_types SET protype_name = '${pt_name}', categoryId = null, updatedAt = now() WHERE id = '${pt_id}'`;
		else
			sql = `UPDATE product_types SET protype_name = '${pt_name}', categoryId = '${cat_id}', updatedAt = now() WHERE id = '${pt_id}'`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.UPDATE
		});
	};

	ProductType.delete = async idProductType => {
		let sql = `DELETE FROM product_types pt WHERE pt.id = '${idProductType}' AND NOT EXISTS (SELECT * FROM products p WHERE p.productTypeId = pt.id)`;
		await sequelize.query(sql, {
			type: sequelize.QueryTypes.DELETE
		});
	};

	ProductType.findById = async id => {
		let sql = `SELECT * FROM product_types WHERE id = ${id}`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
	};

	ProductType.findAllProductTypeNotParent = function() {
		let res = ProductType.findAll({
			where: {
				categoryId: null
			}
		});
		return res;
	};

	return ProductType;
};
