let multer = require("multer");
const path = require("path");
const db = require("../models");

// get all messages
exports.list = (req, res, next) => {
  db.Message.findAll({
    where: {
      messageParentId: 0,
    },
  })
    .then((messages) => {
      // res.send(messages);
      res.status(200).json({ messages });
    })
    .catch((error) => res.status(400).json({ error }));
};

// get message from parent id
exports.listFromParent = (req, res, next) => {
  db.Message.findAll({
    where: {
      messageParentId: req.params.id,
    },
  })
    .then((messages) => {
      // res.send(messages);
      res.status(200).json({ messages });
    })
    .catch((error) => res.status(400).json({ error }));
};

// get single message bu id
exports.getOne = (req, res, next) => {
  db.Message.findOne({
    where: {
      id: req.params.id,
    },
  }).then((message) => {
    res.status(200).json({ message });
    // res.send(message);
  });
};

// post message
exports.create = (req, res, next) => {
  console.log(req.file);
  console.log(req.body.message.title);
  let msg = JSON.parse(req.body.message);
  // res.status(400).json({ test: msg });
  db.Message.create({
    title: msg.title,
    message: msg.message,
    userId: msg.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    messageParentId: msg.messageParentId,
  })
    .then((last) => {
      res.status(201).json({ last: last });
    })
    .catch((error) => res.status(400).json({ error }));
};

// delete message
exports.delete = (req, res, next) => {
  db.Message.destroy({
    where: {
      id: req.params.id,
    },
  }).then(() => {
    res.send("success");
  });
};

// update message
exports.edit = (req, res, next) => {
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
};
