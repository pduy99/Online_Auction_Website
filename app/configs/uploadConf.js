var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/img/sp/'); //hỉnh ảnh sẽ chưa trong folder uploads
	},
	filename: (req, file, cb) => {
		let imgName = Date.now();
		cb(null, imgName + '.jpg');
		req.session.img_name = imgName;
	}
});

var upload = multer({ storage: storage }); //save trên local của server khi dùng multer

module.exports = upload;
