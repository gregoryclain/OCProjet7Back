const express = require("express");
const router = express.Router();
const db = require("../models");
router.get("/message/list", (req, res) => {
  db.Message.findAll().then((messages) => {
    res.send(messages);
  });
});

module.exports = router;
