const express = require("express");
const router = express.Router();
// const multer = require("../middleware/multer-config");
// const auth = require("../middleware/auth");
// const validator = require("../validators/sauce");
const roleCtrl = require("../controllers/roleController");

router.post("/new", roleCtrl.create);
router.delete("/delete/:id", roleCtrl.delete);
router.put("/edit/:id", roleCtrl.edit);
router.get("/:id", roleCtrl.getOne);
router.get("/list", roleCtrl.list);

module.exports = router;
