module.exports = function(sequelize, Sequelize) {
    var BidDetails = sequelize.define('bid_details', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        time: {
            type: Sequelize.DATE,
            notEmpty: true
        },

        price: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        max_price: {
            type: Sequelize.INTEGER,
        }
    });
    BidDetails.findAllHistory = function(id) {
        let sql = `SELECT * FROM bid_details b,users s WHERE b.productId = ${id} AND b.userId = s.id order by b.id desc`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };
    BidDetails.findTheHighestBidder = function(id) {
        let sql = `SELECT * FROM bid_details b,users s WHERE b.productId = ${id} AND b.userId = s.id ORDER BY b.id DESC LIMIT 1 `;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };

    BidDetails.countBiddersOfProduct = async function(proId) {
        let sql =
            'SELECT COUNT(DISTINCT userId) as count FROM BID_DETAILS WHERE productId = ' +
            proId;
        let res = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
        return res[0].count;
    };
    BidDetails.findAllBidder = function() {
        let sql = `SELECT *,bd.id as BDID FROM bid_details bd, users s, products p WHERE bd.userId=s.id AND  bd.productId = p.id`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };
    BidDetails.findAllProductInBid = function() {
        let sql = `SELECT DISTINCT productId FROM bid_details`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };
    BidDetails.findTheHighestBidder2 = function(id) {
        let sql = `SELECT * FROM bid_details b,users s WHERE b.productId = ${id} AND b.userId = s.id ORDER BY b.price DESC `;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };
    BidDetails.findAllUserInBid = function(id) {
        let sql = `SELECT DISTINCT userId FROM bid_details WHERE productId = ${id}`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };
    BidDetails.findMaxPriceUserInBid = function(id, userId) {
        let sql = `SELECT * FROM bid_details WHERE productId = ${id} AND userId = ${userId}`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };

    BidDetails.top1BidingUserId = function(proId) {
        return BidDetails.findOne({
            limit: 1,
            order: [
                [sequelize.col('price'), 'DESC']
            ]
        }).then(function(result) {
            if (result) {
                var userId = result.price;
                return userId;
            } else {
                console.log('Could Not Find');
            }
        });
    };

    BidDetails.GetAllBiderOfProduct = function(proId) {
        let sql = `Select distinct u.email from bid_details b, users u where b.userId = u.id and b.productId = ${proId} `;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };

    BidDetails.findProStepCost = function(id) {
        let sql = `SELECT  step_cost FROM products WHERE id = ${id}`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };

    BidDetails.findFirstBidOfUser = function(id, pro_Id) {
        let sql = `SELECT * FROM bid_details WHERE userId = ${id} AND productId = ${pro_Id}`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    };
    BidDetails.findFirstBidderBidPro = function(pro_Id) {
        let sql = `SELECT * FROM bid_details WHERE productId = ${pro_Id} `;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    }
    BidDetails.findFirstBidderBidPro2 = function(id) {
        let sql = `SELECT * FROM bid_details b,users s WHERE b.productId = ${id} AND b.userId = s.id ORDER BY b.id DESC`;
        return sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });
    }
    return BidDetails;
};