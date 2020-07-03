// const mongoose = require("mongoose");
const db = require("../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const User = require("../models/user");

exports.signup = (req, res, next) => {
  const Role = db.User.belongsTo(db.Role, { as: "role" }); // ne permet pas d'enregistrer + de 2 users
  // const Role = db.User.belongsTo(db.Role, {}); // met le roleId dans user a null
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      db.User.create(
        {
          email: req.body.email,
          password: hash,
          role: { title: "user" },
        },

        {
          include: [Role],
        }
        // [
        //   {
        //     association: db.User,
        //     include: [db.User.role],
        //   },
        // ]
      )
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  db.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "mot de passe incorrect !" });
          }
          res.status(200).json({
            user: user,
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "24h" }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));

  // User.findOne({ email: req.body.email })
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(401).json({ error: "Utilisateur non trouvé !" });
  //     }
  //     bcrypt
  //       .compare(req.body.password, user.password)
  //       .then((valid) => {
  //         if (!valid) {
  //           return res.status(401).json({ error: "mot de passe incorrect !" });
  //         }
  //         res.status(200).json({
  //           userId: user._id,
  //           token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
  //         });
  //       })
  //       .catch((error) => res.status(500).json({ error }));
  //   })
  //   .catch((error) => res.status(500).json({ error }));
};
