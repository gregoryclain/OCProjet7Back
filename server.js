// const http = require("http");
require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const multer = require("./middleware/multer-config");
const auth = require("./middleware/auth");
const { apiLimiter } = require("./middleware/ratelimit");
const path = require("path");
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

// **************** MODELE *********************
// **************** user ***********************
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
  roleId: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

// **************** MODELE *********************
// **************** post ***********************
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
    type: Sequelize.Sequelize.UUID,
    allowNull: true,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

// **************** MODELE *********************
// **************** role ***********************
const Role = connection.define("Role", {
  title: Sequelize.STRING(255),
});

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// **************** ROUTES *********************
// **************** role ***********************
// *********************************************
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
      where: { id: reqparams.id },
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

// **************** ROUTES *********************
// **************** user ***********************
// *********************************************
// signup
app.post("/api/users/signup", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email: req.body.email,
        name: req.body.name,
        password: hash,
        roleId: 1,
        // role: { title: "user" },
      })
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});

// delete
app.delete("/api/users/delete/:id", auth, (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.status(201).json({ message: "Utilisateur détruit !" }))
    .catch((error) => res.status(400).json({ error }));
});

// login
app.post("/api/users/login", apiLimiter, (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
    include: [Role],
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

// get all users
app.get("/api/users/list", (req, res) => {
  User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// **************** ROUTES *********************
// **************** post ***********************
// *********************************************
// create post
app.post("/api/messages/new", auth, multer, (req, res) => {
  let msg = JSON.parse(req.body.message);
  let imageUrl = null;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  Post.create({
    title: msg.title,
    message: msg.message,
    userId: msg.userId,
    imageUrl: imageUrl,
    messageParentId: msg.messageParentId,
  })
    .then((post) => {
      Post.findOne({
        where: {
          id: post.id,
        },
        include: [User],
      }).then((newPost) => {
        res.status(201).json({ last: newPost });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});
// delete post
app.delete("/api/messages/delete/:id", auth, (req, res) => {
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
app.put("/api/messages/edit/:id", auth, multer, (req, res) => {
  let msg = JSON.parse(req.body.message);
  Post.update(
    {
      title: msg.title,
      message: msg.message,
    },
    {
      where: { id: req.params.id },
      include: [User],
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
app.get("/api/messages/responses/:id", auth, (req, res) => {
  Post.findAll({
    where: {
      messageParentId: req.params.id,
    },
    include: [User],
    order: [["createdAt", "ASC"]],
  })
    .then((messages) => {
      res.status(200).json({ messages });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get last message from parent id
app.get("/api/messages/last/:id", auth, (req, res) => {
  Post.findAll({
    limit: 1,
    where: {
      messageParentId: req.params.id,
    },
    include: [User],
    order: [["createdAt", "DESC"]],
  })
    .then((last) => {
      res.status(200).json({ last });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get all parent post
app.get("/api/messages/parent/list", auth, (req, res) => {
  Post.findAll({
    where: {
      messageParentId: "0",
    },
    include: [User],
    order: [["createdAt", "DESC"]],
  })
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get all post from one user
app.get("/api/messages/list/user/:id", auth, (req, res) => {
  Post.findAll({
    where: {
      userId: req.params.id,
    },
    // include: [User],
    order: [["createdAt", "DESC"]],
  })
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get all post
app.get("/api/messages/list", auth, (req, res) => {
  Post.findAll({
    limit: 10,
    include: [User],
    order: [["createdAt", "DESC"]],
  })
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// get one post
app.get("/api/messages/:id", auth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    include: [User],
  })
    .then((message) => {
      res.status(200).json({ message });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

// ***************************************************
// **************** ASSOCIATIONS *********************
// ***************************************************

User.belongsTo(Role, { foreignKey: "roleId", onDelete: "CASCADE" });
Post.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  hooks: true,
}); // si on veut spécifier explicitement la clé étrangère

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
