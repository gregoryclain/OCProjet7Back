const db = require("../models");

// get all roles
exports.list = (req, res, next) => {
  db.Role.findAll().then((roles) => {
    res.send(roles);
  });
};

// get one role
exports.getOne = (req, res, next) => {
  db.Role.findOne({
    where: {
      id: req.params.id,
    },
  }).then((messages) => {
    res.send(messages);
  });
};

// create a new role
exports.create = (req, res, next) => {
  db.Role.create({
    title: req.body.title,
  }).then((last) => {
    res.send(last);
  });
};

// delete role
exports.delete = (req, res, next) => {
  db.Role.destroy({
    where: {
      id: req.params.id,
    },
  }).then(() => {
    res.send("success");
  });
};

// edit role
exports.edit = (req, res, next) => {
  db.Role.update(
    {
      title: req.body.title,
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
