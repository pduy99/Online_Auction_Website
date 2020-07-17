const express = require('express');
const router = express.Router();

const bidderController = require('../controllers/bidder.controller');
const auth = require('../middleware/auth.middleware');

//  Thêm/Xóa 1 sản phẩm -> Danh sách WatchList của user
router.post('/watchlist/:proid', bidderController.actWatchList);

router.post(
	'/bid/:proid',
	auth.enoughRatingPoint,
	auth.isNotInBlackList,
	bidderController.bid
);

router.post('/buynow/:proid', bidderController.buynow);

router.get('/watchlist', bidderController.watchlist);
router.get('/mybid', bidderController.mybid);
router.get('/mywinningproduct', bidderController.mywinpro);
router.get('/feedbacks', bidderController.feedbacks);
router.post('/rating/:winnerId', bidderController.rating);
router.post('/addpoint', bidderController.addpoint);
router.post('/minuspoint', bidderController.minuspoint);
router.post('/TEST', bidderController.findBiddingUserId);
module.exports = router;
