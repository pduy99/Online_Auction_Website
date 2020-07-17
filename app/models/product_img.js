const fs = require('fs');

module.exports = function(sequelize, Sequelize) {
	var ProductImg = sequelize.define('product_img', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},

		img_name: {
			type: Sequelize.STRING
		},
		is_main_img: {
			type: Sequelize.BOOLEAN,
			defaultValue: 0
		}
	});

	ProductImg.saveAndRename = async function(
		oldName,
		imgName,
		isMainImg,
		proId
	) {
		await ProductImg.create({
			// img_name: f.filename,
			img_name: imgName,
			is_main_img: isMainImg ? 1 : 0,
			productId: proId
		});
		fs.rename(
			`./public/img/sp/${oldName}`,
			`./public/img/sp/${imgName}.jpg`,
			function(err) {
				if (err) console.log('ERROR: ' + err);
			}
		);
	};

	ProductImg.createFromArr = async function(files, isMainImg, proId) {
		if (isMainImg) {
			files.forEach(async f => {
				await ProductImg.create({
					// img_name: f.filename,
					img_name: proId,
					is_main_img: isMainImg ? 1 : 0,
					productId: proId
				});

				// Đổi tên file ảnh
				fs.rename(
					`./public/img/sp/${f.filename}`,
					`./public/img/sp/${proId}.jpg`,
					function(err) {
						if (err) console.log('ERROR: ' + err);
					}
				);
			});
		} else {
			let imgname;
			let i = 1;
			for (const f of files) {
				imgname = proId + '-' + i;
				await ProductImg.saveAndRename(
					f.filename,
					imgname,
					isMainImg,
					proId
				);
				++i;
			}
			// files.forEach(async f => {
			// 	ProductImg.create({
			// 		// img_name: f.filename,
			// 		img_name: imgname,
			// 		is_main_img: isMainImg ? 1 : 0,
			// 		productId: proId
			// 	}).then(() => {
			// 		// Đổi tên file ảnh
			// 		fs.rename(
			// 			`./public/img/sp/${f.filename}`,
			// 			`./public/img/sp/${imgname}.jpg`,
			// 			function(err) {
			// 				if (err) console.log('ERROR: ' + err);
			// 			}
			// 		);
			// 		i++;
			// 		imgname = proId + '-' + i;
			// 	});
			// });
		}
	};

	return ProductImg;
};
