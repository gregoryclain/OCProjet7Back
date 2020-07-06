const http = require("http");
require("dotenv").config();
// const app = require("./app");
const express = require("express");
const Sequelize = require("sequelize");

const app = express();
const port = 8002;

// database connexion info
const connection = new Sequelize("ocp7new", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
});

// exemple model
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
    validate: {
      isAlphanumeric: true,
    },
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
  const id = Role.destroy({
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
// router.post("/signup", userCtrl.signup);
// router.post("/login", userCtrl.login);

// **************** post ****************
// router.post("/new", multer, messageCtrl.create);
// router.delete("/delete/:id", messageCtrl.delete);
// router.put("/edit/:id", messageCtrl.edit);
// router.get("/responses/:id", messageCtrl.listFromParent);
// router.get("/list", messageCtrl.list);
// router.get("/:id", messageCtrl.getOne);

User.belongsTo(Role, { foreignKey: "roleId" });
Post.belongsTo(User, { foreignKey: "userId" }); // la meme chose mais si on veut spécifier explicitement la clé étrangère
connection
  .sync({
    logging: console.log,
    force: true, // pour forcer recréation bdd ?
  })
  .then(() => {
    Role.create({
      title: "user",
    });
    Role.create({
      title: "iscom",
    });
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
