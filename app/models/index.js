'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'configs', 'config.json'))[env];
var sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config
);
var db = {};

fs.readdirSync(__dirname)
	.filter(function(file) {
		return file.indexOf('.') !== 0 && file !== 'index.js';
	})
	.forEach(function(file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

// Associations

// Product
db.product.hasMany(db.bid_details);
db.product.hasMany(db.watchlist);
db.product.hasMany(db.blacklist);
db.product.belongsTo(db.product_type);
db.product.hasMany(db.product_img);
db.product.belongsTo(db.user, { as: 'Seller', foreignKey: 'sellerId' });
db.product.belongsTo(db.user, { as: 'Winner', foreignKey: 'winnerId' });

// Category
db.category.hasMany(db.product_type, {
	as: 'ProductTypes',
	foreignKey: 'categoryId'
});

// ProductType
db.product_type.belongsTo(db.category, {
	as: 'Category',
	foreignKey: 'categoryId'
});
db.product_type.hasMany(db.product);

// User
db.user.hasMany(db.bid_details);
db.user.hasMany(db.watchlist);
db.user.hasMany(db.blacklist);
db.user.hasMany(db.product, { as: 'Products', foreignKey: 'sellerId' });
db.user.hasMany(db.product, { as: 'WinProducts', foreignKey: 'winnerId' });

// BidDetails
db.bid_details.belongsTo(db.product);
db.bid_details.belongsTo(db.user);

// WatchList
db.watchlist.belongsTo(db.product);
db.watchlist.belongsTo(db.user);

// ProductImg
db.product_img.belongsTo(db.product);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
