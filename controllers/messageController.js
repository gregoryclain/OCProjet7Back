const db = require("../models");

// get all messages
exports.list = (req, res, next) => {
  db.Message.findAll()
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
    res.send(message);
  });
};

// post message
exports.create = (req, res, next) => {
  db.Message.create({
    title: req.body.title,
    message: req.body.message,
    userId: req.body.userId,
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
