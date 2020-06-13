const express = require("express");
const router = express.Router();
const db = require("../models");

// get all messages
router.get("/message/list", (req, res) => {
  db.Message.findAll().then((messages) => {
    res.send(messages);
  });
});

// post message
router.post("/message/new", (req, res) => {
  db.Message.create({
    title: req.body.title,
    message: req.body.message,
  }).then((last) => {
    res.send(last);
  });
});

module.exports = router;
