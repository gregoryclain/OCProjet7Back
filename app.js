// var mysql = require("mysql");
const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

// gestion cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// connexion bdd avec orm sequelize

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });
const db = require("./models");
const PORT = process.env.PORT || "3000";
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Listening on : http://localhost:3000");
  });
});

app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true, limit: "2b" }));
app.use("/images", express.static(path.join(__dirname, "images"))); // définition du répertoire statique d'upload d'images

// import des routes
const messageRoutes = require("./routes/message");
const roleRoutes = require("./routes/role");
const userRoutes = require("./routes/user");
// const apiRoutes = require("./routes/apiRoutes");
app.use("/api/roles", roleRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
