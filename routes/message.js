const express = require("express");
const router = express.Router();
// const multer = require("../middleware/multer-config");
// const auth = require("../middleware/auth");
// const validator = require("../validators/sauce");
const messageCtrl = require("../controllers/messageController");

router.post("/new", messageCtrl.create);
router.delete("/delete/:id", messageCtrl.delete);
router.put("/edit/:id", messageCtrl.edit);
router.get("/:id", messageCtrl.getOne);
router.get("/list", messageCtrl.list);

module.exports = router;
