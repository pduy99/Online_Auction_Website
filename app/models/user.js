module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        firstname: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        lastname: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        username: {
            type: Sequelize.TEXT
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },

        address: {
            type: Sequelize.TEXT
        },

        password: {
            type: Sequelize.STRING
        },

        role: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },

        facebook_id: {
            type: Sequelize.STRING
        },

        facebook_token: {
            type: Sequelize.STRING,
            default: ''
        },

        like_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        report_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },

        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        upgrade: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    });

    User.isEnableToBid = function(user) {
        // Bidder chưa từng được đánh giá -> Được quyền ra giá (trong trường hợp người bán cho phép - tạm thời không quan tâm cái này)
        if (user.like_count === 0 && user.report_count === 0) return true;

        let rating = Math.floor(
            user.like_count / (user.like_count + user.report_count)
        );
        console.log('>>>>> ', rating);
        if (rating >= 0.8) return true;
        return false;
    };

    User.EditProfile = function(user) {
        return User.update({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            address: user.address
        }, {
            where: {
                id: user.id
            }
        });
    };

    User.Activate = function(email) {
        return User.update({
            status: 'active'
        }, {
            where: {
                email: email
            }
        });
    };

    User.Deactivate = function(user) {
        return User.update({
            status: 'inactive'
        }, {
            where: {
                id: user.id
            }
        });
    };

    User.ChangeEmail = function(user) {
        return User.update({
            email: user.email,
            status: 'inactive'
        }, {
            where: {
                id: user.id
            }
        });
    };

    User.ChangePassword = function(user) {
        return User.update({
            password: user.password
        }, {
            where: {
                id: user.id
            }
        });
    };
    User.findLikeCountUser = function(id) {
        return User.findOne({
            where: {
                id: id
            }
        }).then(function(result) {
            if (result) {
                var LikeCount = result.like_count;
                return LikeCount;
            } else {
                console.log('Could Not Find User');
            }
        });
    };
    User.findUserUpgrade = function() {
        return User.findAll({
            where: {
                upgrade: 1
            }
        });
    }

    User.upgradeBidderToSeller = function(id) {
        return User.update({
            role: 1,
            upgrade: 0
        }, {
            where: {
                id: id
            }
        });
    }

    User.findSeller = () =>{
        return User.findAll({
            where: {
                role: 1
            }
        });
    }

    User.findBidder = () =>{
        return User.findAll({
            where: {
                role: 0
            }
        });
    }

    User.addUser = async user => {
		let sql = `INSERT INTO users(firstname, lastname, username, email, address, password, role, createdAt, updatedAt) VALUES ("${user.firstname}", "${user.lastname}", "${user.username}", "${user.email}", "${user.address}", "${user.password}", "${user.role}", now(), now())`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.INSERT
		});
	};

    User.findById = async (id) => {
        let sql = `SELECT * FROM users WHERE id = ${id}`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
    };

    User.updateUser = async (id, user) => {
        let sql = `UPDATE users SET lastname = '${user.lastname}', firstname = '${user.firstname}', username = '${user.username}', email = '${user.email}', address = '${user.address}', password = '${user.password}', role = '${user.role}', updatedAt = now() WHERE id = '${id}';`;
		return sequelize.query(sql, {
			type: sequelize.QueryTypes.UPDATE
		});
    };

    User.delete = async id => {
		let sql = `DELETE FROM users WHERE id = '${id}'`;
		await sequelize.query(sql, {
			type: sequelize.QueryTypes.DELETE
		});
	};

    return User;
}; 