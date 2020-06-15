const express = require("express");
const router = express.Router();
const db = require("../models");

// get all messages
router.get("/message/list", (req, res) => {
  db.Message.findAll().then((messages) => {
    res.send(messages);
  });
});

// get single message bu id
router.get("/message/find/:id", (req, res) => {
  db.Message.findOne({
    where: {
      id: req.params.id,
    },
  }).then((message) => {
    res.send(message);
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

// delete message
router.delete("/message/delete/:id", (req, res) => {
  db.Message.destroy({
    where: {
      id: req.params.id,
    },
  }).then(() => {
    res.send("success");
  });
});

// update message
router.put("/message/edit", (req, res) => {
  db.Message.update(
    {
      title: req.body.title,
      message: req.body.message,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  ).then(() => {
    res.send("success");
  });
});
module.exports = router;
