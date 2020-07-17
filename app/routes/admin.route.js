const express = require("express");
const router = express.Router();

const admincontroller = require("../controllers/admin.controller");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect('/auth/login');
}

router.get("/", isLoggedIn, (req, res) => {
    if (req.user.role === 2) {
        res.redirect("/admin/category");
    } else {
        res.redirect("/");
    }
});
router.get("/category", isLoggedIn, admincontroller.category);
router.get("/product", isLoggedIn, admincontroller.product);
router.get("/product/delete", isLoggedIn, admincontroller.deleteProduct);
router.get("/category/add", isLoggedIn, admincontroller.fillCategory);
router.post("/category/add", admincontroller.addCategory);
router.get("/category/update", isLoggedIn, admincontroller.fillUpdateCategory);
router.post("/category/update", admincontroller.updateCategory);
router.get("/category/delete", isLoggedIn, admincontroller.deleteCategory);
router.get("/category/addPT", isLoggedIn, admincontroller.fillProductType);
router.post("/category/addPT", admincontroller.addProductType);
router.get("/category/updatePT", isLoggedIn, admincontroller.fillUpdateProductType);
router.post("/category/updatePT", admincontroller.updateProductType);
router.get("/category/deletePT", isLoggedIn, admincontroller.deleteProductType);
// router.get("/bidder", isLoggedIn, admincontroller.findAllBidder);
router.get("/userupgrade", isLoggedIn, admincontroller.findAllUserUpgrade);
router.get("/userupgrade/upgrade", admincontroller.upbiddertoseller);
router.get("/seller", isLoggedIn, admincontroller.seller);
router.get("/bidder", isLoggedIn, admincontroller.bidder);
router.get("/user/add", isLoggedIn, admincontroller.fillUser);
router.post("/user/add", admincontroller.addUser);
router.get("/user/update", isLoggedIn, admincontroller.fillUpdateUser);
router.post("/user/update", admincontroller.updateUser);
router.get("/user/delete", isLoggedIn, admincontroller.deleteUser);

module.exports = router;