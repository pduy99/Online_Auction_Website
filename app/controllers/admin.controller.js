const models = require("../models");

module.exports.category = async function (req, res) {
    if (req.user.role === 2) {
        let Cats = await models.category.categoriesAndChild();
        let PTs = await models.product_type.findAllProT();
        res.render("web/admin-category", {
            layout: "admin-main.hbs",
            title: "QUẢN LÝ DANH MỤC",
            user: [req.user],
            Cats: Cats,
            PTs: PTs
        });
    } else {
        res.redirect("/");
    }
};

module.exports.product = async (req, res) => {
    if (req.user.role === 2) {
        let Products = await models.product.findAllPro();
        res.render("web/admin-product", {
            layout: "admin-main.hbs",
            title: "QUẢN LÝ SẢN PHẨM",
            user: [req.user],
            Products: Products
        });
    } else {
        res.redirect("/");
    }
};

module.exports.deleteProduct = async (req, res, next) => {
    await models.product.delete(req.query.id);
    res.redirect("/admin/product/");
};

//

module.exports.fillCategory = (req, res) => {
    if (req.user.role === 2) {
        res.render("web/admin-fillCategory", {
            layout: "admin-main.hbs",
            user: [req.user],
            title: "THÊM DANH MỤC"
        });
    } else {
        res.redirect("/");
    }
};

module.exports.addCategory = async (req, res, next) => {
    await models.category.addCat(req.body.cat_name);
    res.redirect("/admin/category/");
};

module.exports.fillUpdateCategory = async (req, res) => {
    if (req.user.role === 2) {
        const C = await models.category.findById(req.query.id);
        res.render("web/admin-fillCategory", {
            layout: "admin-main.hbs",
            title: "CẬP NHẬT DANH MỤC",
            user: [req.user],
            C: C
        });
    } else {
        res.redirect("/");
    }
};

module.exports.updateCategory = async (req, res, next) => {
    await models.category.updateCat(req.query.id, req.body.cat_name);
    res.redirect("/admin/category/");
};

module.exports.deleteCategory = async (req, res, next) => {
    await models.category.delete(req.query.id);
    res.redirect("/admin/category/");
};

//

module.exports.fillProductType = async (req, res) => {
    if (req.user.role === 2) {
        const Cats = await models.category.categoriesAndChild();
        res.render("web/admin-fillProductType", {
            layout: "admin-main.hbs",
            title: "THÊM DANH MỤC CON",
            user: [req.user],
            Cats: Cats
        });
    } else {
        res.redirect("/");
    }
};

module.exports.addProductType = async (req, res, next) => {
    await models.product_type.add(req.body.pt_name, req.body.cat_id);
    res.redirect("/admin/category/");
};

module.exports.fillUpdateProductType = async (req, res) => {
    if (req.user.role === 2) {
        const Cats = await models.category.categoriesAndChild();
        const PT = await models.product_type.findById(req.query.id);
        console.log(PT);
        res.render("web/admin-fillProductType", {
            layout: "admin-main.hbs",
            title: "CẬP NHẬT DANH MỤC CON",
            user: [req.user],
            PT: PT,
            Cats: Cats
        });
    } else {
        res.redirect("/");
    }
};

module.exports.updateProductType = async (req, res, next) => {
    await models.product_type.update(req.query.id, req.body.pt_name, req.body.cat_id);
    res.redirect("/admin/category/");
};

module.exports.deleteProductType = async (req, res, next) => {

    await models.product_type.delete(req.query.id);
    res.redirect("/admin/category/");
};

module.exports.findAllBidder = async (req, res, next) => {
    let Bidder = await models.bid_details.findAllBidder();
    res.render("web/admin-bidder", {
        layout: "admin-main.hbs",
        title: "QUẢN LÝ NGƯỜI ĐẤU GIÁ",
        user: [req.user],
        Bidder: Bidder
    });
};

module.exports.findAllUserUpgrade = async (req, res, next) => {
    let UserUpgrade = await models.user.findUserUpgrade();
    res.render("web/admin-userupgrade", {
        layout: "admin-main.hbs",
        title: "DANH SÁCH NGƯỜI ĐẤU GIÁ CHỜ NÂNG CẤP LÊN NGƯỜI BÁN",
        user: [req.user],
        UserUpgrade: UserUpgrade
    });
};

module.exports.upbiddertoseller = async (req, res, next) => {
    await models.user.upgradeBidderToSeller(req.query.id);
    res.redirect("/admin/userupgrade/");
};

module.exports.seller = async (req, res, next) => {
    let Sellers = await models.user.findSeller();
    res.render("web/admin-seller", {
        layout: "admin-main.hbs",
        title: "QUẢN LÝ NGƯỜI BÁN",
        user: [req.user],
        Sellers: Sellers
    });
};

module.exports.bidder = async (req, res, next) => {
    let Bidders = await models.user.findBidder();
    res.render("web/admin-bidder", {
        layout: "admin-main.hbs",
        title: "QUẢN LÝ NGƯỜI ĐẤU GIÁ",
        user: [req.user],
        Bidders: Bidders
    });
};

module.exports.fillUser = (req, res) => {
    if (req.user.role === 2) {
        res.render("web/admin-fillUser", {
            layout: "admin-main.hbs",
            user: [req.user],
            title: "THÊM NGƯỜI DÙNG"
        });
    } else {
        res.redirect("/");
    }
};
module.exports.addUser = async (req, res, next) => {
    await models.user.addUser(req.body);
    if (req.body.role == 1)
        res.redirect("/admin/seller/");
    else if (req.body.role == 0)
    res.redirect("/admin/bidder/");
    else res.redirect("/admin");
};
module.exports.fillUpdateUser = async (req, res) => {
    if (req.user.role === 2) {
        const User = await models.user.findById(req.query.id);
        res.render("web/admin-fillUser", {
            layout: "admin-main.hbs",
            user: [req.user],
            User: User,
            title: "CẬP NHẬT NGƯỜI DÙNG"
        });
    } else {
        res.redirect("/");
    }
};
module.exports.updateUser = async (req, res, next) => {
    await models.user.updateUser(req.query.id, req.body);
    if (req.body.role == 1)
        res.redirect("/admin/seller/");
    else if (req.body.role == 0)
    res.redirect("/admin/bidder/");
    else res.redirect("/admin");
};

module.exports.deleteUser = async (req,res) => {
    await models.user.delete(req.query.id);
    res.redirect("/admin/seller/");
};