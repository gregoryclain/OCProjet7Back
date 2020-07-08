const http = require("http");
require("dotenv").config();
// const app = require("./app");
const express = require("express");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// gestion cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// database connexion info
const connection = new Sequelize("ocp7new", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
});

// user model
const User = connection.define("User", {
  name: Sequelize.STRING(255),
  email: {
    type: Sequelize.STRING(255),
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    // validate: {
    //   isAlphanumeric: true,
    // },
  },
});

// post model
const Post = connection.define("Post", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  title: Sequelize.STRING(255),
  imageUrl: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  messageParentId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// role model
const Role = connection.define("Role", {
  title: Sequelize.STRING(255),
});

app.use(bodyParser.json());
// **************** routes role ****************
// create role
app.post("/api/roles/new", (req, res) => {
  const newRole = req.body.role;
  Role.create(newRole)
    .then((role) => {
      res.json(role);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// delete role
app.delete("/api/roles/delete/:id", (req, res) => {
  Role.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      res.send("Role successfully deleted");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// edit role
app.put("/api/roles/edit/:id", (req, res) => {
  Role.update(
    { title: req.body.title },
    {
      where: { id: params.id },
    }
  )
    .then((role) => {
      res.json(role);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get all roles
app.get("/api/roles/list", (req, res) => {
  Role.findAll()
    .then((roles) => {
      res.json(roles);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get one role
app.get("/api/roles/:id", (req, res) => {
  Role.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((role) => {
      res.json(role);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// **************** user ****************
// signup
// router.post("/signup", userCtrl.signup);
app.post("/api/users/signup", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        // role: { title: "user" },
      })
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});
// login
// router.post("/login", userCtrl.login);
app.post("/api/users/login", (req, res) => {
  User.findOne({
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
});

// **************** post ****************

// router.get("/responses/:id", messageCtrl.listFromParent);
// router.get("/list", messageCtrl.list);

// create post
// router.post("/new", multer, messageCtrl.create);
app.post("/api/messages/new", (req, res) => {
  let msg = JSON.parse(req.body.message);
  Post.create({
    title: msg.title,
    message: msg.message,
    userId: msg.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    messageParentId: msg.messageParentId,
  })
    .then((last) => {
      res.status(201).json({ last: last });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

// delete post
// router.delete("/delete/:id", messageCtrl.delete);
app.delete("/api/messages/delete/:id", (req, res) => {
  Post.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      res.send("message successfully deleted");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// edit post
// router.put("/edit /: id", messageCtrl.edit);
app.put("/api/messages/edit/:id", (req, res) => {
  Post.update(
    {
      title: req.body.title,
      message: req.body.message,
    },
    {
      where: { id: params.id },
    }
  )
    .then((message) => {
      res.json(message);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get message from parent id
//router.get("/responses/:id", messageCtrl.listFromParent);
app.get("/api/messages/responses/:id", (req, res) => {
  Post.findOne({
    where: {
      messageParentId: req.params.id,
    },
  })
    .then((messages) => {
      res.status(200).json({ messages });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get all post
app.get("/api/messages/list", (req, res) => {
  Post.findAll({
    where: {
      messageParentId: 0,
    },
  })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get one post
// router.get("/:id", messageCtrl.getOne);
app.get("/api/messages/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((message) => {
      res.status(200).json({ message });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

User.belongsTo(Role, { foreignKey: "roleId" });
Post.belongsTo(User, { foreignKey: "userId" }); // la meme chose mais si on veut spécifier explicitement la clé étrangère
connection
  .sync({
    logging: console.log,
    // force: true, // pour forcer recréation bdd ?
  })
  .then(() => {
    // Role.create({
    //   title: "user",
    // });
    // Role.create({
    //   title: "iscom",
    // });
  })
  .then(() => {
    console.log("connection to database established succesfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database", err);
  });

app.listen(port, () => {
  console.log("Running server on port " + port);
});
