const express = require("express");
const router = express.Router();
// const multer = require("../middleware/multer-config");
// const auth = require("../middleware/auth");
// const validator = require("../validators/sauce");
const userCtrl = require("../controllers/userController");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
