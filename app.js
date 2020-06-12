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

// db.sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log("listening on :3000")
//   })
// })

// connexion bdd avec orm sequelize
// const sequelize = new Sequelize("ocp7", "root", "", { host: "localhost", dialect: "mysql" });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true, limit: "2b" }));
app.use("/images", express.static(path.join(__dirname, "images"))); // définition du répertoire statique d'upload d'images

// // import des routes
// var forumRoutes = require("./routes/forumRoutes");
// // const sauceRoutes = require("./routes/sauce");

// // ajout des routes dans l'app
// // app.use("/api/auth", userRoutes);
// app.use("/api/forum", forumRoutes);

module.exports = app;
